import { Routes } from '@angular/router';

import { AER_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common';
import { AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN } from '@requests/common/timeline/aer-common/aer-verification-submitted-common.routes';

export const AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX = 'verify-aer-submitted';

export const AER_VERIFICATION_SUBMITTED_ROUTES: Routes = [
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
