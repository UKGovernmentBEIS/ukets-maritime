import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { of } from 'rxjs';
import { produce } from 'immer';

import { TasksService } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { mockClass, MockType, RouterStubComponent } from '@netz/common/testing';

import { RequestDeadlineExtensionSummaryComponent } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-summary/request-deadline-extension-summary.component';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';
import { taskProviders } from '@requests/common/task.providers';
import { NotifyUsersService } from '@shared/services';

describe('RequestDeadlineExtensionSummaryComponent', () => {
  let harness: RouterTestingHarness;
  let component: RequestDeadlineExtensionSummaryComponent;
  let router: Router;

  const signatory = '11111111-1111-4111-a111-111111111111';
  const tasksService = mockClass(TasksService);
  const notifyUsersService: MockType<NotifyUsersService> = {
    getAllOperatorsInfo: vi.fn().mockReturnValue(
      of({
        autoNotifiedOperators: {
          '33333333-3333-4333-a333-333333333333': {
            contactTypes: ['PRIMARY'],
            name: 'Operator3 England',
            roleCode: 'operator_admin',
          },
        },
        otherOperators: {
          '44444444-4444-4444-a444-444444444444': { contactTypes: [], name: 'Operator4', roleCode: 'operator' },
        },
      }),
    ),
    getAssignees: vi.fn().mockReturnValue(of([{ text: 'Regulator England', value: signatory }])),
  };

  const rows = (): Record<string, HTMLElement> =>
    Object.fromEntries(
      Array.from(harness.routeNativeElement.querySelectorAll<HTMLElement>('.govuk-summary-list__row')).map((row) => [
        row.querySelector('dt').textContent.trim(),
        row.querySelector('dd'),
      ]),
    );

  const setup = async (allowedRequestTaskActions: string[]) => {
    await TestBed.configureTestingModule({
      imports: [RequestDeadlineExtensionSummaryComponent],
      providers: [
        provideRouter([
          {
            path: 'tasks/:taskId',
            children: [
              { path: 'rde/submit', component: RequestDeadlineExtensionSummaryComponent },
              { path: 'file-download/:fileType/:uuid', component: RouterStubComponent },
            ],
          },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TasksService, useValue: tasksService },
        { provide: NotifyUsersService, useValue: notifyUsersService },
        ...taskProviders,
      ],
    }).compileComponents();

    TestBed.inject(RequestTaskStore).setState(
      produce(mockRequestTask, (state) => {
        state.requestTaskItem.requestTask.id = 632;
        state.requestTaskItem.requestTask.type = 'EMP_ISSUANCE_APPLICATION_REVIEW';
        state.requestTaskItem.allowedRequestTaskActions = allowedRequestTaskActions;
      }),
    );
    TestBed.inject(RequestDeadlineExtensionStore).setRde({
      extensionDate: '2026-12-02',
      deadline: '2026-12-01',
      signatory,
      operators: ['44444444-4444-4444-a444-444444444444'],
    });

    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/tasks/632/rde/submit', RequestDeadlineExtensionSummaryComponent);
    harness.detectChanges();
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tasksService.processRequestTaskAction.mockReturnValue(of({}) as any);
  });

  it('should create', async () => {
    await setup([]);

    expect(component).toBeTruthy();
  });

  it('should display the official notice preview link under the recipients when RDE_SAVE is allowed', async () => {
    await setup(['RDE_SAVE', 'RDE_SUBMIT']);

    const summary = rows();
    expect(Object.keys(summary)).toEqual([
      'Proposed due date',
      'Reply deadline',
      'Users',
      'Name and signature on the official notice',
      'Official notice',
    ]);
    expect(summary['Name and signature on the official notice'].textContent.trim()).toEqual('Regulator England');

    const link = summary['Official notice'].querySelector('a');
    expect(link.textContent.trim()).toEqual('letter_preview.pdf');
    expect(link.getAttribute('target')).toEqual('_blank');

    const href = new URL(link.getAttribute('href'), 'http://localhost');
    expect(href.pathname).toEqual('/tasks/632/file-download/document-preview/IN_RDE');
    expect(href.searchParams.get('filename')).toEqual('letter_preview.pdf');
    expect(href.searchParams.get('signatory')).toEqual(signatory);
    expect(href.searchParams.getAll('operators')).toEqual(['44444444-4444-4444-a444-444444444444']);
  });

  it('should display the official notice as not provided when RDE_SAVE is not allowed', async () => {
    await setup(['RDE_SUBMIT']);

    expect(rows()['Official notice'].querySelector('a')).toBeNull();
    expect(rows()['Official notice'].textContent.trim()).toEqual('Not provided');
  });

  it('should submit the request and navigate to the success page', async () => {
    await setup(['RDE_SAVE', 'RDE_SUBMIT']);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onSubmit();

    expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
      requestTaskId: 632,
      requestTaskActionType: 'RDE_SUBMIT',
      requestTaskActionPayload: {
        rdePayload: {
          extensionDate: '2026-12-02',
          deadline: '2026-12-01',
          signatory,
          operators: ['44444444-4444-4444-a444-444444444444'],
        },
        payloadType: 'RDE_SUBMIT_PAYLOAD',
      },
    });
    expect(navigateSpy).toHaveBeenCalledWith(['success'], { relativeTo: expect.anything() });
  });
});
