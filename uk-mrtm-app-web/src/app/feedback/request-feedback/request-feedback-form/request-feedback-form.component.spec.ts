import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { RequestFeedbackAPIService, RequestFeedbackDetailsDTO } from '@mrtm/api';

import { BusinessErrorService } from '@netz/common/error';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { RequestFeedbackFormComponent } from '@feedback/request-feedback/request-feedback-form/request-feedback-form.component';

describe('RequestFeedbackFormComponent', () => {
  let component: RequestFeedbackFormComponent;
  let fixture: ComponentFixture<RequestFeedbackFormComponent>;
  let page: Page;
  let router: Router;

  const requestFeedbackService = {
    getRequestFeedbackDetails: vi.fn(),
    submitRequestFeedback: vi.fn(),
  };
  const businessErrorService: MockType<BusinessErrorService> = {
    showError: vi.fn().mockReturnValue(of(true)),
  };

  class Page extends BasePage<RequestFeedbackFormComponent> {
    checkbox(name: string, value: string): HTMLInputElement {
      return this.query<HTMLInputElement>(`input[name$="${name}"][value="${value}"]`);
    }

    radio(value: string): HTMLInputElement {
      return this.query<HTMLInputElement>(`input[name$="easeRating"][value="${value}"]`);
    }

    get checkboxLabels(): string[] {
      return this.queryAll<HTMLLabelElement>('.govuk-checkboxes__label').map((label) => label.textContent.trim());
    }

    set otherReportCompletionMethods(value: string) {
      this.setInputValue('#otherReportCompletionMethods', value);
    }

    set feedbackReviewGroupsComment(value: string) {
      this.setInputValue('#feedbackReviewGroupsComment', value);
    }

    get feedbackReviewGroupsCommentTextarea(): HTMLTextAreaElement {
      return this.query<HTMLTextAreaElement>('#feedbackReviewGroupsComment');
    }

    set additionalComments(value: string) {
      this.setInputValue('#additionalComments', value);
    }
  }

  const createComponent = (type: string, details: RequestFeedbackDetailsDTO = { status: 'NEW', expired: false }) => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(of(details));

    TestBed.configureTestingModule({
      imports: [RequestFeedbackFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { requestId: 'MAR00001-2025', type }) },
        { provide: RequestFeedbackAPIService, useValue: requestFeedbackService },
        { provide: BusinessErrorService, useValue: businessErrorService },
      ],
    });

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RequestFeedbackFormComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  const click = (element: HTMLElement) => {
    element.click();
    fixture.detectChanges();
  };

  beforeEach(() => vi.clearAllMocks());

  describe('for EMP issuance', () => {
    beforeEach(() => createComponent('EMP_ISSUANCE_SUBMIT'));

    it('should display the EMP feedback form', () => {
      expect(component).toBeTruthy();
      expect(requestFeedbackService.getRequestFeedbackDetails).toHaveBeenCalledWith(
        'MAR00001-2025',
        'EMP_ISSUANCE_SUBMIT',
      );
      expect(page.heading1.textContent.trim()).toEqual(
        'Give feedback on your emissions monitoring plan application experience',
      );
      expect(page.checkboxLabels).toContain('Uploaded an EU XML for a single ship');
      expect(page.checkboxLabels).toContain('Delegated responsibility');
      expect(page.submitButton.textContent.trim()).toEqual('Send feedback');
    });

    it('should display errors for missing mandatory answers', () => {
      click(page.submitButton);

      expect(page.errorSummaryListContents).toEqual([
        'Select a rating for the process of completing your application',
        'Select the methods you used to complete the application',
        "Select the sections you want to give feedback on, or select 'No, I do not want to give feedback on any of these sections'",
      ]);
      expect(requestFeedbackService.submitRequestFeedback).not.toHaveBeenCalled();
    });

    it('should require other methods when other is selected', () => {
      click(page.radio('EASY'));
      click(page.checkbox('reportCompletionMethods', 'OTHER'));
      click(page.checkbox('feedbackReviewGroups', 'NO_FEEDBACK'));
      click(page.submitButton);

      expect(page.errorSummaryListContents).toEqual(['Enter the methods you used to complete the application']);
    });

    it('should reveal and require the sections comment only when a section is selected', () => {
      expect(page.feedbackReviewGroupsCommentTextarea).toBeNull();
      expect(component.form.controls.feedbackReviewGroupsComment.disabled).toBe(true);

      click(page.checkbox('feedbackReviewGroups', 'NO_FEEDBACK'));

      expect(page.feedbackReviewGroupsCommentTextarea).toBeNull();

      click(page.radio('EASY'));
      click(page.checkbox('reportCompletionMethods', 'TYPED_INTO_FORM_SECTIONS'));
      click(page.checkbox('feedbackReviewGroups', 'DATA_GAPS'));

      expect(page.feedbackReviewGroupsCommentTextarea).toBeTruthy();

      click(page.submitButton);

      expect(page.errorSummaryListContents).toEqual(['Enter your feedback']);
    });

    it('should keep the no feedback option exclusive and disable the sections comment', () => {
      click(page.checkbox('feedbackReviewGroups', 'DATA_GAPS'));
      click(page.checkbox('feedbackReviewGroups', 'NO_FEEDBACK'));

      expect(component.form.controls.feedbackReviewGroups.value).toEqual(['NO_FEEDBACK']);
      expect(component.form.controls.feedbackReviewGroupsComment.disabled).toBe(true);
      expect(page.feedbackReviewGroupsCommentTextarea).toBeNull();

      click(page.checkbox('feedbackReviewGroups', 'MANDATE'));

      expect(component.form.controls.feedbackReviewGroups.value).toEqual(['MANDATE']);
      expect(component.form.controls.feedbackReviewGroupsComment.enabled).toBe(true);
      expect(page.feedbackReviewGroupsCommentTextarea).toBeTruthy();
    });

    it('should submit the feedback and navigate to the confirmation', () => {
      requestFeedbackService.submitRequestFeedback.mockReturnValue(of(null));

      click(page.radio('VERY_EASY'));
      click(page.checkbox('reportCompletionMethods', 'TYPED_INTO_FORM_SECTIONS'));
      click(page.checkbox('reportCompletionMethods', 'OTHER'));
      page.otherReportCompletionMethods = 'Copied from previous plan';
      click(page.checkbox('feedbackReviewGroups', 'DATA_GAPS'));
      page.feedbackReviewGroupsComment = 'Data gaps were unclear';
      page.additionalComments = 'Thanks';
      click(page.submitButton);

      expect(page.errorSummary).toBeNull();
      expect(requestFeedbackService.submitRequestFeedback).toHaveBeenCalledWith(
        'MAR00001-2025',
        'EMP_ISSUANCE_SUBMIT',
        {
          payloadType: 'EMP_ISSUANCE_SUBMIT_PAYLOAD',
          reportCompletionEaseRating: 'VERY_EASY',
          reportCompletionMethods: ['TYPED_INTO_FORM_SECTIONS', 'OTHER'],
          otherReportCompletionMethods: 'Copied from previous plan',
          feedbackReviewGroups: ['DATA_GAPS'],
          feedbackReviewGroupsComment: 'Data gaps were unclear',
          additionalComments: 'Thanks',
        },
      );
      expect(router.navigate).toHaveBeenCalledWith(['sent'], { relativeTo: TestBed.inject(ActivatedRoute) });
    });

    it('should show an error page when the feedback form expired during submission', () => {
      requestFeedbackService.submitRequestFeedback.mockReturnValue(
        throwError(
          () => new HttpErrorResponse({ status: 400, error: { code: 'REQUESTFEEDBACK1000', message: 'Expired' } }),
        ),
      );

      click(page.radio('EASY'));
      click(page.checkbox('reportCompletionMethods', 'TYPED_INTO_FORM_SECTIONS'));
      click(page.checkbox('feedbackReviewGroups', 'NO_FEEDBACK'));
      click(page.submitButton);

      expect(businessErrorService.showError).toHaveBeenCalledWith(
        expect.objectContaining({ heading: 'This feedback form has expired' }),
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('for AER verification', () => {
    beforeEach(() => createComponent('AER_VERIFICATION_SUBMIT'));

    it('should display verifier sections and submit the opinion statement rating', () => {
      requestFeedbackService.submitRequestFeedback.mockReturnValue(of(null));

      expect(page.heading1.textContent.trim()).toEqual(
        'Give feedback on your verification opinion statement experience',
      );
      expect(page.query('mrtm-feedback-review-groups legend').textContent.trim()).toEqual(
        'Do you want to give feedback on any specific sections of the verification opinion statement process?',
      );
      expect(page.queryAll('mrtm-feedback-review-groups h3').map((heading) => heading.textContent.trim())).toEqual([
        'Verifier assessment',
        'Verifier findings',
      ]);

      click(page.radio('DIFFICULT'));
      click(page.checkbox('reportCompletionMethods', 'IMPORTED_FROM_DATA_SUPPLIER'));
      click(page.checkbox('feedbackReviewGroups', 'NO_FEEDBACK'));
      click(page.submitButton);

      expect(requestFeedbackService.submitRequestFeedback).toHaveBeenCalledWith(
        'MAR00001-2025',
        'AER_VERIFICATION_SUBMIT',
        {
          payloadType: 'AER_VERIFICATION_SUBMIT_PAYLOAD',
          opinionStatementEaseRating: 'DIFFICULT',
          reportCompletionMethods: ['IMPORTED_FROM_DATA_SUPPLIER'],
          otherReportCompletionMethods: null,
          feedbackReviewGroups: ['NO_FEEDBACK'],
          feedbackReviewGroupsComment: null,
          additionalComments: null,
        },
      );
    });
  });

  describe('when the form is not available', () => {
    it.each([
      ['EMP_ISSUANCE_SUBMIT', 'You have already submitted feedback for this application'],
      ['EMP_VARIATION_SUBMIT', 'You have already submitted feedback for this application'],
      ['AER_SUBMIT', 'You have already submitted feedback for this report'],
      ['AER_VERIFICATION_SUBMIT', 'You have already submitted feedback for this report'],
    ])('should show an error page when %s feedback is already submitted', (type, heading) => {
      createComponent(type, { status: 'SUBMITTED', expired: false });

      expect(page.query('form')).toBeNull();
      expect(businessErrorService.showError).toHaveBeenCalledWith(expect.objectContaining({ heading }));
    });

    it('should show an error page when the feedback form expired', () => {
      createComponent('AER_SUBMIT', { status: 'NEW', expired: true });

      expect(page.query('form')).toBeNull();
      expect(businessErrorService.showError).toHaveBeenCalledWith(
        expect.objectContaining({ heading: 'This feedback form has expired' }),
      );
    });

    it('should show an error page for an unknown feedback type', () => {
      createComponent('UNKNOWN');

      expect(requestFeedbackService.getRequestFeedbackDetails).not.toHaveBeenCalled();
      expect(businessErrorService.showError).toHaveBeenCalledWith(
        expect.objectContaining({ heading: 'This feedback form is not available' }),
      );
    });
  });
});
