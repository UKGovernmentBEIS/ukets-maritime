import { Routes } from '@angular/router';

import { REPORTING_OBLIGATION_SUB_TASK_PATH } from '@requests/common/aer/subtasks/reporting-obligation';
import { AER_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common/aer-submitted-common.routes';
import { AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common/aer-verification-submitted-common.routes';

export const AER_REVIEWED_ROUTES: Routes = [
  ...AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN,
  ...AER_SUBMITTED_ROUTES_COMMON_CHILDREN,
  {
    path: REPORTING_OBLIGATION_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/reporting-obligation-submitted').then(
        (c) => c.ReportingObligationSubmittedComponent,
      ),
  },
];
