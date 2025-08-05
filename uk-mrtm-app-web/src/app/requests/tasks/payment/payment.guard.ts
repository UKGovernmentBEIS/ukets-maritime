import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { PaymentService } from '@requests/tasks/payment/services';

export const canActivatePayment: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return isEditable || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};

const canActivatePaymentSubtask =
  (allowedAction: string): CanActivateFn =>
  (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
    const store = inject(RequestTaskStore);
    const allowedActions = store.select(requestTaskQuery.selectAllowedRequestTaskActions)();

    return allowedActions.includes(allowedAction) || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../../']);
  };

export const canActivateMakePayment: CanActivateFn = canActivatePaymentSubtask('PAYMENT_MARK_AS_PAID');
export const canActivateCancelPayment: CanActivateFn = canActivatePaymentSubtask('PAYMENT_CANCEL');
export const canActivateMarkAsReceivedPayment: CanActivateFn = canActivatePaymentSubtask('PAYMENT_MARK_AS_RECEIVED');

export const resetState: CanActivateFn = () => {
  const service = inject(TaskService) as PaymentService;

  return service.resetState();
};
