import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  canActivateCancelPayment,
  canActivateMakePayment,
  canActivateMarkAsReceivedPayment,
  canActivatePayment,
  resetState,
} from '@requests/tasks/payment/payment.guard';
import {
  providePaymentFlowManagers,
  providePaymentPayloadMutators,
  providePaymentTaskServices,
} from '@requests/tasks/payment/payment.providers';
import { CANCEL_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/cancel';
import { MAKE_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/make';
import { MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/mark-as-received';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      providePaymentTaskServices(),
      providePaymentPayloadMutators(),
      providePaymentFlowManagers(),
    ],
    canActivate: [canActivatePayment],
    children: [
      {
        path: MAKE_PAYMENT_ROUTE_PREFIX,
        canActivate: [canActivateMakePayment, resetState],
        loadChildren: () => import('@requests/tasks/payment/subtasks/make').then((r) => r.MAKE_PAYMENT_ROUTES),
      },
      {
        path: CANCEL_PAYMENT_ROUTE_PREFIX,
        canActivate: [canActivateCancelPayment],
        loadChildren: () => import('@requests/tasks/payment/subtasks/cancel').then((r) => r.CANCEL_PAYMENT_ROUTES),
      },
      {
        path: MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX,
        canActivate: [canActivateMarkAsReceivedPayment],
        loadChildren: () =>
          import('@requests/tasks/payment/subtasks/mark-as-received').then((r) => r.MARK_AS_RECEIVED_PAYMENT_ROUTES),
      },
    ],
  },
];
