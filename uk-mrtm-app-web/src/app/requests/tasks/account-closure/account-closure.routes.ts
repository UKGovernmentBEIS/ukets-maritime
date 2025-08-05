import { Routes } from '@angular/router';

import {
  AccountClosureConfirmationComponent,
  AccountClosureSuccessComponent,
} from '@requests/tasks/account-closure/components';

export const ACCOUNT_CLOSURE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'confirmation',
        title: 'Close account',
        data: { backlink: '../../', breadcrumb: false },
        component: AccountClosureConfirmationComponent,
      },
      {
        path: 'success',
        title: 'Close account',
        component: AccountClosureSuccessComponent,
      },
    ],
  },
];
