import { Routes } from '@angular/router';

import { CREATE_ACTION_TYPE } from '@requests/common/types';
import { CREATE_ACTION } from '@requests/workflows/create-action/create-action.helpers';
import { requestCreateActionGuard } from '@requests/workflows/create-action/request-create-action.guard';

export const CREATE_ACTION_ROUTES: Routes = [
  {
    path: `${CREATE_ACTION_TYPE.DOE}`,
    canActivate: [requestCreateActionGuard],
    providers: [{ provide: CREATE_ACTION, useValue: CREATE_ACTION_TYPE.DOE }],
    children: [],
  },
  {
    path: `${CREATE_ACTION_TYPE.AER_REINITIATE}`,
    providers: [{ provide: CREATE_ACTION, useValue: CREATE_ACTION_TYPE.AER_REINITIATE }],
    loadChildren: () =>
      import('@requests/workflows/create-action/aer-re-initiate').then((r) => r.AER_RE_INITIATE_ROUTES),
  },
];
