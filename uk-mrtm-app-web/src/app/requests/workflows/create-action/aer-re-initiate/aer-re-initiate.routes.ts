import { Routes } from '@angular/router';

import { AerReInitiateStep } from '@requests/workflows/create-action/aer-re-initiate/aer-re-initiate.helpers';
import { requestCreateActionGuard } from '@requests/workflows/create-action/request-create-action.guard';

export const AER_RE_INITIATE_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../' },
    title: 'Return to operator for changes',
    loadComponent: () =>
      import('@requests/workflows/create-action/aer-re-initiate/aer-re-initiate-question').then(
        (c) => c.AerReInitiateQuestionComponent,
      ),
  },
  {
    path: AerReInitiateStep.PROCESS,
    canActivate: [requestCreateActionGuard],
    children: [],
  },
  {
    path: AerReInitiateStep.SUCCESS,
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('@requests/workflows/create-action/aer-re-initiate/aer-re-initiate-success').then(
        (c) => c.AerReInitiateSuccessComponent,
      ),
  },
];
