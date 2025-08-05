import { Routes } from '@angular/router';

import { reportingObligationMap } from '@requests/common/aer';
import {
  REPORTING_OBLIGATION_SUB_TASK,
  REPORTING_OBLIGATION_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/reporting-obligation';
import {
  AER_REVIEW_GROUP,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_TASK_TITLE,
} from '@requests/tasks/aer-review/aer-review.constants';
import { provideReportingObligationDetailsSubtaskSummary } from '@requests/tasks/aer-review/subtasks/reporting-obligation/reporting-obligation-summary.providers';

export const REPORTING_OBLIGATION_SUBTASK_ROUTES: Routes = [
  {
    path: REPORTING_OBLIGATION_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: REPORTING_OBLIGATION_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: reportingObligationMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'REPORTING_OBLIGATION_DETAILS' },
      provideReportingObligationDetailsSubtaskSummary,
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
];
