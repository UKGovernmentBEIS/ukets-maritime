import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { AccountVerificationBodyService } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonService } from '@requests/common/aer/services';
import { taskProviders } from '@requests/common/task.providers';
import { SendReportComponent } from '@requests/tasks/aer-submit/subtasks/send-report/send-report/send-report.component';
import { screen } from '@testing-library/angular';

describe('SendReportComponent', () => {
  let component: SendReportComponent;
  let fixture: ComponentFixture<SendReportComponent>;
  let store: RequestTaskStore;
  let payload: AerSubmitTaskPayload;
  let accountVerificationBodyServiceMock: MockType<AccountVerificationBodyService>;
  let router: Router;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<AerCommonService> = {
    submit: jest.fn().mockReturnValue(of({})),
    submitForVerification: jest.fn().mockReturnValue(of({})),
  };

  const createComponent = async (payload: AerSubmitTaskPayload) => {
    await TestBed.configureTestingModule({
      imports: [SendReportComponent, RouterModule.forRoot([])],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AccountVerificationBodyService, useValue: accountVerificationBodyServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    router = TestBed.inject(Router);
    store.setState({
      ...mockRequestTask,
      requestTaskItem: {
        ...mockRequestTask.requestTaskItem,
        allowedRequestTaskActions: [
          'AER_SAVE_APPLICATION',
          'AER_UPLOAD_SECTION_ATTACHMENT',
          'AER_SUBMIT_APPLICATION',
          'AER_REQUEST_VERIFICATION',
          'AER_FETCH_EMP_LIST_OF_SHIPS',
        ],
        requestInfo: {
          ...mockRequestTask.requestTaskItem.requestInfo,
          id: 'MAR00001-2024',
          requestMetadata: {
            type: 'AER',
            year: '2024',
            initiatorRequest: { requestType: 'AER' },
            exempted: false,
          } as any,
          type: 'AER',
        },
        requestTask: {
          ...mockRequestTask.requestTaskItem.requestTask,
          type: 'AER_APPLICATION_SUBMIT',
          payload,
        },
      },
    });

    fixture = TestBed.createComponent(SendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(() => {
    accountVerificationBodyServiceMock = {
      getVerificationBodyOfAccount: jest.fn().mockReturnValue(of({ id: 123, name: 'test verification body 123' })),
    };
  });

  it('should create', async () => {
    await createComponent({
      payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
      reportingRequired: false,
    });
    expect(component).toBeTruthy();
  });

  describe('send report to regulator', () => {
    beforeEach(() => {
      payload = {
        payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
        reportingRequired: false,
      };
    });

    it('should display correct header and content', async () => {
      await createComponent(payload);
      expect(screen.getByRole('heading', { name: 'Send report to regulator' })).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph').map((paragraph) => paragraph.textContent.trim())).toEqual([
        'Your report will be sent directly to Environment Agency.',
        'By selecting ‘Confirm and send’ you confirm that the information in your report is correct to the best of your knowledge.',
      ]);

      expect(screen.getByRole('button', { name: 'Confirm and send' })).toBeInTheDocument();
    });

    it('should submit task', async () => {
      await createComponent(payload);
      const taskServiceSpy = jest.spyOn(taskServiceMock, 'submit');
      const navigateSpy = jest.spyOn(router, 'navigate');
      taskServiceSpy.mockReturnValue(of(null));
      screen.getByRole('button', { name: 'Confirm and send' }).click();
      fixture.detectChanges();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(['success'], {
        relativeTo: activatedRouteStub,
        skipLocationChange: true,
      });
    });
  });

  describe('send report to verifier', () => {
    beforeEach(() => {
      payload = {
        payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
        reportingYear: 2024,
        reportingRequired: true,
        verificationPerformed: false,
      };
    });

    it('should display an error message when no verifier body set', async () => {
      accountVerificationBodyServiceMock = {
        getVerificationBodyOfAccount: jest.fn().mockReturnValue(of(null)),
      };
      await createComponent(payload);
      expect(
        screen.getByRole('heading', {
          name: 'Your named verifier is invalid. Please make sure a verification body has been successfully added to your account.',
        }),
      ).toBeInTheDocument();
    });

    it('should display correct header and content', async () => {
      await createComponent(payload);
      expect(screen.getByRole('heading', { name: 'Send report to verifier' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Current verifier' })).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph').map((paragraph) => paragraph.textContent.trim())).toEqual([
        'test verification body 123',
        'By selecting ‘Confirm and send’ you confirm that the information in your report is correct to the best of your knowledge.',
      ]);
      expect(screen.getByRole('button', { name: 'Confirm and send' })).toBeInTheDocument();
    });

    it('should submit task', async () => {
      await createComponent(payload);
      const taskServiceSpy = jest.spyOn(taskServiceMock, 'submitForVerification');
      const navigateSpy = jest.spyOn(router, 'navigate');
      screen.getByRole('button', { name: 'Confirm and send' }).click();
      fixture.detectChanges();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(['success'], {
        relativeTo: activatedRouteStub,
        skipLocationChange: true,
      });
    });
  });
});
