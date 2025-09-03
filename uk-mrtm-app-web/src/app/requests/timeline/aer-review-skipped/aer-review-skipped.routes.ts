import { Routes } from '@angular/router';

import { AER_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common';
import { AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common/aer-verification-submitted-common.routes';

export const AER_REVIEW_SKIPPED_ROUTE_PREFIX = 'aer-completed-without-review';

export const AER_REVIEW_SKIPPED_ROUTES: Routes = [
  {
    path: '',
    children: [
      // Verifier assessment
      ...AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN,
      // Operator's application
      ...AER_SUBMITTED_ROUTES_COMMON_CHILDREN,
    ],
  },
];
