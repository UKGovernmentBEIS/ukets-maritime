import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { isNil } from 'lodash-es';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { PAYMENT_ROUTE_PREFIX } from '@requests/common/payment';
import { paymentQuery } from '@requests/tasks/payment/+state';
import { PAYMENT_TASKS } from '@requests/tasks/payment/payment.constants';
import { PaymentService } from '@requests/tasks/payment/services';
import { MAKE_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/make';

export const canActivatePayment: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const paymentInProgress =
    !isNil(store.select(requestTaskQuery.selectRequestInfo)()?.paymentCompleted) ||
    !isNil(store.select(requestTaskQuery.selectRequestInfo)()?.paymentAmount);

  return isEditable || paymentInProgress || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};

const canActivatePaymentSubtask =
  (allowedAction: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(RequestTaskStore);
    const allowedActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();

    return allowedActions.includes(allowedAction) || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../../']);
  };

export const canActivateMakePayment: CanActivateFn = canActivatePaymentSubtask('PAYMENT_MARK_AS_PAID');
export const canActivateCancelPayment: CanActivateFn = canActivatePaymentSubtask('CANCEL_APPLICATION');
export const canActivateMarkAsReceivedPayment: CanActivateFn = canActivatePaymentSubtask('PAYMENT_MARK_AS_RECEIVED');

export const canActivatePendingPaymentProcess = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const taskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const allowedActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const externalPaymentId = store.select(paymentQuery.selectExternalPaymentId)();

  if (
    PAYMENT_TASKS.includes(taskType) &&
    !isNil(externalPaymentId) &&
    isEditable &&
    allowedActions.includes('PAYMENT_MARK_AS_PAID')
  ) {
    return createUrlTreeFromSnapshot(activatedRouteSnapshot, [PAYMENT_ROUTE_PREFIX, MAKE_PAYMENT_ROUTE_PREFIX]);
  }

  return true;
};

export const resetState: CanActivateFn = () => {
  const service = inject(TaskService) as PaymentService;

  return service.resetState();
};
