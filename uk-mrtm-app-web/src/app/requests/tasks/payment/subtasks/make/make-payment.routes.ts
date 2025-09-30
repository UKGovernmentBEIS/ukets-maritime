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
    title: 'Make payment by bank transfer',
    canActivate: [canActivateBankTransfer],
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: `../${MakePaymentWizardSteps.PAYMENT_METHOD}` },
        loadComponent: () =>
          import('@requests/tasks/payment/subtasks/make/payment-bank-transfer').then(
            (c) => c.PaymentBankTransferComponent,
          ),
      },
      {
        path: MakePaymentWizardSteps.BANK_TRANSFER_SUBMIT,
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
    data: { pageTitle: 'Payment not completed', breadcrumb: true },
    loadComponent: () =>
      import('@requests/tasks/payment/subtasks/make/payment-not-success').then((c) => c.PaymentNotSuccessComponent),
  },
];
