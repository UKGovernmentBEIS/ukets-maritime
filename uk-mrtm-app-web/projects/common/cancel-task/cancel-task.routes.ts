import { Routes } from '@angular/router';

import { CancelComponent } from './cancel';
import { ConfirmationComponent } from './confirmation';

export const ROUTES: Routes = [
  {
    path: '',
    title: 'Task cancellation',
    data: { breadcrumb: false, backlink: '../' },
    component: CancelComponent,
  },
  {
    path: 'confirmation',
    title: 'Task cancelled',
    component: ConfirmationComponent,
  },
];
