import { Routes } from '@angular/router';

import { MakePaymentWizardSteps } from '@requests/tasks/payment/subtasks/make/make-payment.constants';
import {
  canActivateBankTransfer,
  canActivatePaymentSummary,
  pendingPaymentExist,
} from '@requests/tasks/payment/subtasks/make/make-payment.guards';

export const MAKE_PAYMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: MakePaymentWizardSteps.PAYMENT_METHOD,
    pathMatch: 'full',
  },
  {
    path: MakePaymentWizardSteps.PAYMENT_METHOD,
    title: 'Make payment options',
    canActivate: [pendingPaymentExist],
    data: { breadcrumb: false, backlink: '../../../' },
    loadComponent: () => import('@requests/tasks/payment/subtasks/make').then((c) => c.PaymentMethodComponent),
  },
  {
    path: MakePaymentWizardSteps.BANK_TRANSFER,
    canActivate: [canActivateBankTransfer],
    children: [
      {
        path: '',
        title: 'Pay by bank transfer',
        data: { breadcrumb: false, backlink: `../${MakePaymentWizardSteps.PAYMENT_METHOD}` },
        loadComponent: () =>
          import('@requests/tasks/payment/subtasks/make/payment-bank-transfer').then(
            (c) => c.PaymentBankTransferComponent,
          ),
      },
      {
        path: MakePaymentWizardSteps.BANK_TRANSFER_SUBMIT,
        title: 'Are you sure you want to mark this payment as paid?',
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/tasks/payment/subtasks/make/payment-bank-transfer-confirm').then(
            (c) => c.PaymentBankTransferConfirmComponent,
          ),
      },
    ],
  },
  {
    path: MakePaymentWizardSteps.CONFIRMATION,
    title: 'Payment completed',
    canActivate: [canActivatePaymentSummary],
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/make/payment-success').then((c) => c.PaymentSuccessComponent),
  },
  {
    path: MakePaymentWizardSteps.NOT_SUCCESS,
    title: 'Payment not completed',
    data: { breadcrumb: true },
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/make/payment-not-success').then((c) => c.PaymentNotSuccessComponent),
  },
];
