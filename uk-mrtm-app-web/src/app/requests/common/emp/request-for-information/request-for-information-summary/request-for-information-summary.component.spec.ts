import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { of } from 'rxjs';
import { produce } from 'immer';

import { TasksService } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { mockClass, MockType, RouterStubComponent } from '@netz/common/testing';

import { RequestForInformationSummaryComponent } from '@requests/common/emp/request-for-information/request-for-information-summary/request-for-information-summary.component';
import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';
import { taskProviders } from '@requests/common/task.providers';
import { NotifyUsersService } from '@shared/services';

describe('RequestForInformationSummaryComponent', () => {
  let harness: RouterTestingHarness;
  let component: RequestForInformationSummaryComponent;

  const signatory = '11111111-1111-4111-a111-111111111111';
  const tasksService = mockClass(TasksService);
  const notifyUsersService: MockType<NotifyUsersService> = {
    getAllOperatorsInfo: vi.fn().mockReturnValue(of({ autoNotifiedOperators: {}, otherOperators: {} })),
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
      imports: [RequestForInformationSummaryComponent],
      providers: [
        provideRouter([
          {
            path: 'tasks/:taskId',
            children: [
              { path: 'rfi/submit', component: RequestForInformationSummaryComponent },
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
    TestBed.inject(RequestForInformationStore).setRfi({
      questions: ['Question 1'],
      files: [],
      deadline: '2026-12-01',
      signatory,
      operators: [],
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/tasks/632/rfi/submit', RequestForInformationSummaryComponent);
    harness.detectChanges();
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', async () => {
    await setup([]);

    expect(component).toBeTruthy();
  });

  it('should display the official notice preview link under the recipients when RFI_SAVE is allowed', async () => {
    await setup(['RFI_SAVE', 'RFI_SUBMIT']);

    const summary = rows();
    expect(Object.keys(summary)).toEqual([
      'Question 1',
      'Uploaded files',
      'Response deadline',
      'Users',
      'Name and signature on the official notice',
      'Official notice',
    ]);

    const link = summary['Official notice'].querySelector('a');
    expect(link.textContent.trim()).toEqual('letter_preview.pdf');
    expect(link.getAttribute('target')).toEqual('_blank');

    const href = new URL(link.getAttribute('href'), 'http://localhost');
    expect(href.pathname).toEqual('/tasks/632/file-download/document-preview/IN_RFI');
    expect(href.searchParams.get('filename')).toEqual('letter_preview.pdf');
    expect(href.searchParams.get('signatory')).toEqual(signatory);
  });

  it('should display the official notice as not provided when RFI_SAVE is not allowed', async () => {
    await setup(['RFI_SUBMIT']);

    expect(rows()['Official notice'].querySelector('a')).toBeNull();
    expect(rows()['Official notice'].textContent.trim()).toEqual('Not provided');
  });
});
