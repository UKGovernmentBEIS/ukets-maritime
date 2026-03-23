import { Routes } from '@angular/router';

import { sendVariationApplicationGuard } from '@requests/common/emp/subtasks/send-variation/send-variation.guard';

export const SEND_VARIATION_ROUTES: Routes = [
  {
    path: '',
    title: 'Send variation application to regulator',
    data: { backlink: '../../', breadcrumb: false },
    canActivate: [sendVariationApplicationGuard],
    loadComponent: () => import('./send-variation-confirmation').then((c) => c.SendVariationConfirmationComponent),
  },
  {
    path: 'success',
    loadComponent: () => import('./send-variation-success').then((c) => c.SendVariationSuccessComponent),
  },
];
