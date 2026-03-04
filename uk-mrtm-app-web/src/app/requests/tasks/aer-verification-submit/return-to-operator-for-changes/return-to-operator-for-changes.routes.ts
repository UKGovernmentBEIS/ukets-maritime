import { Routes } from '@angular/router';

import {
  canActivateReturnToOperatorForChangesForm,
  canActivateReturnToOperatorForChangesSuccess,
  canActivateReturnToOperatorForChangesSummary,
} from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes.guard';

export const RETURN_TO_OPERATOR_FOR_CHANGES_ROUTES: Routes = [
  {
    path: '',
    title: 'Returned to operator for changes',
    canActivate: [canActivateReturnToOperatorForChangesForm],
    data: {
      breadcrumb: false,
      backlink: '../../',
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes-form/return-to-operator-for-changes-form.component').then(
        (c) => c.ReturnToOperatorForChangesFormComponent,
      ),
  },
  {
    path: 'summary',
    title: 'Return to operator for changes summary',
    canActivate: [canActivateReturnToOperatorForChangesSummary],
    data: {
      breadcrumb: false,
      backlink: '../../../',
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes-summary/return-to-operator-for-changes-summary.component').then(
        (c) => c.ReturnToOperatorForChangesSummaryComponent,
      ),
  },
  {
    path: 'success',
    title: 'Returned to operator for changes',
    canActivate: [canActivateReturnToOperatorForChangesSuccess],
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/return-to-operator-for-changes/return-to-operator-for-changes-success/return-to-operator-for-changes-success.component').then(
        (c) => c.ReturnToOperatorForChangesSuccessComponent,
      ),
  },
];
