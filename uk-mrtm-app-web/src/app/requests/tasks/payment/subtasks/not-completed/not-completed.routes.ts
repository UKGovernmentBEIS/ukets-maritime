import { Routes } from '@angular/router';

export const NOT_COMPLETED_ROUTES: Routes = [
  {
    path: '',
    title: 'Payment not completed',
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/not-completed/payment-not-completed').then(
        (c) => c.PaymentNotCompletedComponent,
      ),
  },
];
