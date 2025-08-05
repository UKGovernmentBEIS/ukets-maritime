import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { catchError, map, of, switchMap } from 'rxjs';
import { isNil } from 'lodash-es';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentService } from '@requests/tasks/payment/services';
import { MakePaymentWizardSteps } from '@requests/tasks/payment/subtasks/make/make-payment.constants';

export const canActivateBankTransfer: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const paymentMethod = store.select(paymentQuery.selectPaymentMethod)();

  return paymentMethod === 'BANK_TRANSFER' || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};

export const canActivatePaymentSummary: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const service = inject(TaskService) as PaymentService;
  const paymentMethod =
    store.select(paymentQuery.selectPaymentMethod)() ?? activatedRouteSnapshot?.queryParams?.['method'];

  return of(paymentMethod).pipe(
    switchMap((method) => {
      if (isNil(paymentMethod)) {
        createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../../../']);
      }

      if (method === 'BANK_TRANSFER') {
        return of(true);
      }

      return service.loadExistingCardProcessInfo().pipe(
        map((res) => {
          const status = res?.state?.status;
          return ['failed', 'cancelled', 'expired'].includes(status)
            ? createUrlTreeFromSnapshot(activatedRouteSnapshot, [`../${MakePaymentWizardSteps.NOT_SUCCESS}`])
            : true;
        }),
        catchError((err) => {
          if (err.code === 'PAYMENT1003') {
            return of(createUrlTreeFromSnapshot(activatedRouteSnapshot, [`../../..`]));
          }
        }),
      );
    }),
  );
};
