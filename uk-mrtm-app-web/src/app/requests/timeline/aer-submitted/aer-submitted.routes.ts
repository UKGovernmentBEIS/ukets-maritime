import { Routes } from '@angular/router';

import { REPORTING_OBLIGATION_SUB_TASK_PATH } from '@requests/common/aer/subtasks/reporting-obligation';
import { AER_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common';

export const AER_SUBMITTED_ROUTE_PREFIX = 'aer-submitted';

export const AER_SUBMITTED_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: REPORTING_OBLIGATION_SUB_TASK_PATH,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/reporting-obligation-submitted').then(
            (c) => c.ReportingObligationSubmittedComponent,
          ),
      },
      ...AER_SUBMITTED_ROUTES_COMMON_CHILDREN,
    ],
  },
];
