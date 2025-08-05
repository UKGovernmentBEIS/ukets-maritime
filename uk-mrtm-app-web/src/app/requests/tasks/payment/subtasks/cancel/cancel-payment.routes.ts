import { Routes } from '@angular/router';

import { CancelPaymentWizardSteps } from '@requests/tasks/payment/subtasks/cancel/cancel-payment.constants';

export const CANCEL_PAYMENT_ROUTES: Routes = [
  {
    path: '',
    title: 'Cancel payment',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/cancel/cancel-payment-form').then((c) => c.CancelPaymentFormComponent),
  },
  {
    path: CancelPaymentWizardSteps.SUCCESS,
    title: 'Payment task cancelled',
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/cancel/cancel-payment-success').then(
        (c) => c.CancelPaymentSuccessComponent,
      ),
  },
];
