import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { PAYMENT_NOT_COMPLETED_ROUTE_PREFIX, PAYMENT_ROUTE_PREFIX } from '@requests/common/payment/payment.constants';

export const isPaymentCompleted: CanActivateFn = () => {
  const store = inject(RequestTaskStore);
  const router = inject(Router);

  const paymentCompleted = store.select(requestTaskQuery.selectRequestInfo)()?.paymentCompleted;
  const taskId = store.select(requestTaskQuery.selectRequestTaskId)();

  return (
    paymentCompleted ||
    router.parseUrl(`/tasks/${taskId}/${PAYMENT_ROUTE_PREFIX}/${PAYMENT_NOT_COMPLETED_ROUTE_PREFIX}`)
  );
};
