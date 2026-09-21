import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { of } from 'rxjs';
import { produce } from 'immer';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { MockType, RouterStubComponent } from '@netz/common/testing';

import { RequestNotificationFormComponent } from '@requests/common/emp/components/request-notification-form/request-notification-form.component';
import {
  REQUEST_NOTIFICATION_DATA,
  REQUEST_NOTIFICATION_PREVIEW_DOCUMENTS_ACTION,
  REQUEST_NOTIFICATION_SERVICE,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.provider';
import { taskProviders } from '@requests/common/task.providers';
import { NotifyUsersService } from '@shared/services';

describe('RequestNotificationFormComponent', () => {
  let harness: RouterTestingHarness;
  let component: RequestNotificationFormComponent;
  let store: RequestTaskStore;
  let router: Router;

  const notifyUsersService: MockType<NotifyUsersService> = {
    getAllOperatorsInfo: vi.fn().mockReturnValue(
      of({
        autoNotifiedOperators: {
          '33333333-3333-4333-a333-333333333333': {
            contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
            name: 'Operator3 England',
            roleCode: 'operator_admin',
          },
        },
        otherOperators: {},
      }),
    ),
    getAssignees: vi.fn().mockReturnValue(
      of([
        {
          text: 'Regulator England',
          value: '11111111-1111-4111-a111-111111111111',
        },
      ]),
    ),
  };
  const notificationService = { setNotification: vi.fn() };

  const documentPreviewHeading = (): HTMLHeadingElement | null =>
    harness.routeNativeElement.querySelector<HTMLHeadingElement>('#document-preview-title');
  const documentPreviewLink = (): HTMLAnchorElement | null =>
    harness.routeNativeElement.querySelector<HTMLAnchorElement>('netz-related-documents a');

  const setup = async (options: { url: string; action: string; allowedRequestTaskActions: string[] }) => {
    await TestBed.configureTestingModule({
      imports: [RequestNotificationFormComponent],
      providers: [
        provideRouter([
          {
            path: 'tasks/:taskId',
            children: [
              { path: 'rfi/submit/notification', component: RequestNotificationFormComponent },
              { path: 'rde/submit/notification', component: RequestNotificationFormComponent },
              { path: 'file-download/:fileType/:uuid', component: RouterStubComponent },
            ],
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotifyUsersService, useValue: notifyUsersService },
        { provide: REQUEST_NOTIFICATION_SERVICE, useValue: notificationService },
        { provide: REQUEST_NOTIFICATION_DATA, useValue: signal({ signatory: null, operators: [] }) },
        { provide: REQUEST_NOTIFICATION_PREVIEW_DOCUMENTS_ACTION, useValue: options.action },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      produce(mockRequestTask, (state) => {
        state.requestTaskItem.requestTask.id = 632;
        state.requestTaskItem.requestTask.type = 'EMP_NOTIFICATION_APPLICATION_REVIEW';
        state.requestTaskItem.allowedRequestTaskActions = options.allowedRequestTaskActions;
      }),
    );

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(options.url, RequestNotificationFormComponent);
    harness.detectChanges();
    vi.clearAllMocks();
  };

  it('should create', async () => {
    await setup({ url: '/tasks/632/rfi/submit/notification', action: 'RFI_SAVE', allowedRequestTaskActions: [] });

    expect(component).toBeTruthy();
  });

  it('should display the RFI document preview when the RFI_SAVE action is allowed', async () => {
    await setup({
      url: '/tasks/632/rfi/submit/notification',
      action: 'RFI_SAVE',
      allowedRequestTaskActions: ['RFI_SAVE', 'RFI_SUBMIT', 'RDE_SAVE', 'RDE_SUBMIT'],
    });

    expect(documentPreviewHeading()?.textContent.trim()).toEqual('Document preview');
    expect(documentPreviewLink()?.textContent.trim()).toEqual('letter_preview.pdf');
    expect(documentPreviewLink()?.getAttribute('href')).toMatch(
      /^\/tasks\/632\/file-download\/document-preview\/IN_RFI\?/,
    );
    expect(documentPreviewLink()?.getAttribute('target')).toEqual('_blank');
  });

  it('should display the RDE document preview when the RDE_SAVE action is allowed', async () => {
    await setup({
      url: '/tasks/632/rde/submit/notification',
      action: 'RDE_SAVE',
      allowedRequestTaskActions: ['RFI_SAVE', 'RFI_SUBMIT', 'RDE_SAVE', 'RDE_SUBMIT'],
    });

    expect(documentPreviewLink()?.textContent.trim()).toEqual('letter_preview.pdf');
    expect(documentPreviewLink()?.getAttribute('href')).toMatch(
      /^\/tasks\/632\/file-download\/document-preview\/IN_RDE\?/,
    );
  });

  it('should not display the document preview when the action is not allowed', async () => {
    await setup({
      url: '/tasks/632/rfi/submit/notification',
      action: 'RFI_SAVE',
      allowedRequestTaskActions: ['RFI_SUBMIT', 'RDE_SAVE', 'RDE_SUBMIT'],
    });

    expect(component.previewDocuments()).toEqual([]);
    expect(documentPreviewHeading()).toBeNull();
    expect(documentPreviewLink()).toBeNull();
  });

  it('should store the notification and navigate to the summary on submit', async () => {
    await setup({
      url: '/tasks/632/rfi/submit/notification',
      action: 'RFI_SAVE',
      allowedRequestTaskActions: ['RFI_SAVE', 'RFI_SUBMIT'],
    });
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component['formGroup'].patchValue({ signatory: '11111111-1111-4111-a111-111111111111', operators: [] });
    component.onSubmit();

    expect(notificationService.setNotification).toHaveBeenCalledWith({
      signatory: '11111111-1111-4111-a111-111111111111',
      operators: [],
    });
    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: expect.anything() });
  });
});
