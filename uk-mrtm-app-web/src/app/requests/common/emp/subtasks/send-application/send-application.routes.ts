import { Routes } from '@angular/router';

export const SEND_APPLICATION_ROUTES: Routes = [
  {
    path: '',
    title: 'Send application to regulator',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/send-application/send-application-confirmation').then(
        (c) => c.SendApplicationConfirmationComponent,
      ),
  },
  {
    path: 'success',
    loadComponent: () => import('./send-application-success').then((c) => c.SendApplicationSuccessComponent),
  },
];
