import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { of } from 'rxjs';
import { produce } from 'immer';

import { TasksService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { mockClass } from '@netz/common/testing';

import { rdeQuery } from '@requests/common/emp/request-deadline-extension/+state';
import { RequestDeadlineExtensionFormComponent } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-form/request-deadline-extension-form.component';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';
import { taskProviders } from '@requests/common/task.providers';

describe('RequestDeadlineExtensionFormComponent', () => {
  let harness: RouterTestingHarness;
  let component: RequestDeadlineExtensionFormComponent;
  let rdeStore: RequestDeadlineExtensionStore;
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  const currentUserId = '87166006-b9df-45d7-94ec-10801e4393d9';
  // The date inputs hold Date objects, which are serialised to ISO strings in the request body.
  const extensionDate = new Date('2026-12-02T00:00:00.000Z') as unknown as string;
  const deadline = new Date('2026-12-01T00:00:00.000Z') as unknown as string;
  const tasksService = mockClass(TasksService);

  const setup = async (url: string) => {
    await TestBed.configureTestingModule({
      imports: [RequestDeadlineExtensionFormComponent],
      providers: [
        provideRouter([
          {
            path: 'tasks/:taskId/rde/submit',
            children: [
              { path: '', component: RequestDeadlineExtensionFormComponent },
              { path: 'deadline-extension', component: RequestDeadlineExtensionFormComponent },
              { path: 'notification', component: RequestDeadlineExtensionFormComponent },
            ],
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TasksService, useValue: tasksService },
        ...taskProviders,
      ],
    }).compileComponents();

    TestBed.inject(RequestTaskStore).setState(
      produce(mockRequestTask, (state) => {
        state.requestTaskItem.requestTask.id = 100;
        state.requestTaskItem.requestTask.type = 'EMP_ISSUANCE_APPLICATION_REVIEW';
        state.requestTaskItem.requestTask.daysRemaining = 10;
        state.requestTaskItem.allowedRequestTaskActions = ['RDE_SAVE', 'RDE_SUBMIT'];
      }),
    );
    TestBed.inject(AuthStore).setUserState({ roleType: 'REGULATOR', status: 'ENABLED', userId: currentUserId });

    rdeStore = TestBed.inject(RequestDeadlineExtensionStore);
    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(url, RequestDeadlineExtensionFormComponent);
    harness.detectChanges();
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tasksService.processRequestTaskAction.mockReturnValue(of({}) as any);
  });

  it('should create', async () => {
    await setup('/tasks/100/rde/submit/deadline-extension');

    expect(component).toBeTruthy();
  });

  it('should save the RDE details, defaulting the signatory to the current user, and continue to the notification step', async () => {
    await setup('/tasks/100/rde/submit/deadline-extension');
    component.formGroup.setValue({ extensionDate, deadline });

    component.onSubmit();
    await harness.fixture.whenStable();

    expect(tasksService.processRequestTaskAction).toHaveBeenCalledTimes(1);
    expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
      requestTaskId: 100,
      requestTaskActionType: 'RDE_SAVE',
      requestTaskActionPayload: {
        rdePayload: { extensionDate, deadline, signatory: currentUserId, operators: [] },
        payloadType: 'RDE_SAVE_PAYLOAD',
      },
    });
    expect(rdeStore.select(rdeQuery.selectRde)()).toEqual({ extensionDate, deadline });
    expect(navigateSpy).toHaveBeenCalledWith(['../', 'notification'], { relativeTo: expect.anything() });
  });

  it('should keep the already selected signatory and operators when saving', async () => {
    await setup('/tasks/100/rde/submit/deadline-extension');
    rdeStore.setRde({ extensionDate, deadline, signatory: 'other-user', operators: ['operator-1'] });
    component.formGroup.setValue({ extensionDate, deadline });

    component.onSubmit();
    await harness.fixture.whenStable();

    expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith(
      expect.objectContaining({
        requestTaskActionPayload: {
          rdePayload: { extensionDate, deadline, signatory: 'other-user', operators: ['operator-1'] },
          payloadType: 'RDE_SAVE_PAYLOAD',
        },
      }),
    );
  });

  it('should return to the summary when submitted in change mode', async () => {
    await setup('/tasks/100/rde/submit/deadline-extension?change=true');
    component.formGroup.setValue({ extensionDate, deadline });

    component.onSubmit();
    await harness.fixture.whenStable();

    expect(tasksService.processRequestTaskAction).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: expect.anything() });
  });
});
