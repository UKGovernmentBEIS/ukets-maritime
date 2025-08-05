import { Routes } from '@angular/router';

import { MarkAsReceivedWizardSteps } from '@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-payment.constants';

export const MARK_AS_RECEIVED_PAYMENT_ROUTES: Routes = [
  {
    path: '',
    title: 'Mark payment as received',
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-form').then(
        (c) => c.MarkAsReceivedFormComponent,
      ),
  },
  {
    path: MarkAsReceivedWizardSteps.SUCCESS,
    title: 'Payment marked as received',
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-success').then(
        (c) => c.MarkAsReceivedSuccessComponent,
      ),
  },
];
