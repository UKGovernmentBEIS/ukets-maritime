import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of, throwError } from 'rxjs';

import { RequestFeedbackAPIService, RequestFeedbackDetailsDTO, RequestTaskItemDTO } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { RequestFeedbackInvitationComponent } from '@feedback/request-feedback/request-feedback-invitation/request-feedback-invitation.component';
import { ServiceFeedbackLinkService } from '@shared/services';

describe('RequestFeedbackInvitationComponent', () => {
  let fixture: ComponentFixture<RequestFeedbackInvitationComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const requestFeedbackService = {
    getRequestFeedbackDetails: vi.fn(),
  };

  class Page extends BasePage<RequestFeedbackInvitationComponent> {
    get feedbackLink(): HTMLAnchorElement {
      return this.query<HTMLAnchorElement>('a');
    }
  }

  const setTask = (taskType: string) =>
    store.setRequestTaskItem({
      requestInfo: { id: 'MAR00001-2025', type: 'AER' },
      requestTask: { id: 1, type: taskType },
    } as RequestTaskItemDTO);

  const createComponent = (type = 'AER_SUBMIT', taskType = 'AER_APPLICATION_SUBMIT') => {
    setTask(taskType);
    fixture = TestBed.createComponent(RequestFeedbackInvitationComponent);
    fixture.componentRef.setInput('type', type);
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [RequestFeedbackInvitationComponent],
      providers: [provideRouter([]), { provide: RequestFeedbackAPIService, useValue: requestFeedbackService }],
    });

    store = TestBed.inject(RequestTaskStore);
  });

  it('should display the invitation when an active feedback form exists', () => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      of({ status: 'NEW', expired: false } as RequestFeedbackDetailsDTO),
    );
    createComponent();

    expect(requestFeedbackService.getRequestFeedbackDetails).toHaveBeenCalledWith('MAR00001-2025', 'AER_SUBMIT');

    expect(page.heading2.textContent).toEqual('Give feedback on the annual emissions report process');
    expect(page.feedbackLink.textContent.trim()).toEqual('Give us your feedback (opens in new tab)');
    expect(page.feedbackLink.target).toEqual('_blank');
    expect(page.feedbackLink.href).toContain('/request-feedback?requestId=MAR00001-2025&type=AER_SUBMIT');
  });

  it('should hide the service feedback link while the invitation is displayed', () => {
    const serviceFeedbackLinkService = TestBed.inject(ServiceFeedbackLinkService);
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      of({ status: 'NEW', expired: false } as RequestFeedbackDetailsDTO),
    );
    createComponent();

    expect(serviceFeedbackLinkService.isVisible()).toBe(false);

    fixture.destroy();

    expect(serviceFeedbackLinkService.isVisible()).toBe(true);
  });

  it('should keep the service feedback link when the invitation is not displayed', () => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      of({ status: 'SUBMITTED', expired: false } as RequestFeedbackDetailsDTO),
    );
    createComponent();

    expect(TestBed.inject(ServiceFeedbackLinkService).isVisible()).toBe(true);
  });

  it('should not display the invitation when feedback is already submitted', () => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      of({ status: 'SUBMITTED', expired: false } as RequestFeedbackDetailsDTO),
    );
    createComponent();

    expect(page.feedbackLink).toBeNull();
  });

  it('should not display the invitation when feedback form has expired', () => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      of({ status: 'NEW', expired: true } as RequestFeedbackDetailsDTO),
    );
    createComponent();

    expect(page.feedbackLink).toBeNull();
  });

  it('should not display the invitation when the request fails, e.g. feature is disabled', () => {
    requestFeedbackService.getRequestFeedbackDetails.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );
    createComponent();

    expect(page.feedbackLink).toBeNull();
  });

  it('should not request feedback details for amend tasks sharing the confirmation page', () => {
    createComponent('AER_VERIFICATION_SUBMIT', 'AER_AMEND_APPLICATION_VERIFICATION_SUBMIT');

    expect(requestFeedbackService.getRequestFeedbackDetails).not.toHaveBeenCalled();
    expect(page.feedbackLink).toBeNull();
  });
});
