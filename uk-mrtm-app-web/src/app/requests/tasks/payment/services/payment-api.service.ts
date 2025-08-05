import { inject } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import {
  CardPaymentCreateResponseDTO,
  CardPaymentProcessResponseDTO,
  PaymentCancelledRequestActionPayload,
  PaymentCancelRequestTaskActionPayload,
  PaymentMarkAsReceivedRequestTaskActionPayload,
  PaymentsService,
} from '@mrtm/api';
import { RequestTaskActionEmptyPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentTaskPayload } from '@requests/tasks/payment/payment.types';
import { SaveActionTypes } from '@shared/types';

export class PaymentApiService extends TaskApiService<PaymentTaskPayload> {
  private readonly paymentsService = inject(PaymentsService);
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'EMP_ISSUANCE_MAKE_PAYMENT':
      case 'DOE_MAKE_PAYMENT':
      case 'EMP_VARIATION_MAKE_PAYMENT':
      case 'EMP_VARIATION_REGULATOR_LED_MAKE_PAYMENT':
      default:
        return {
          actionType: 'PAYMENT_MARK_AS_PAID',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.submitActionTypes;

    return {
      requestTaskActionType: actionType,
      requestTaskId,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
      } as RequestTaskActionEmptyPayload,
    };
  }

  private createCancelAction(payload: PaymentCancelledRequestActionPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskActionType: 'PAYMENT_CANCEL',
      requestTaskId,
      requestTaskActionPayload: {
        ...payload,
        payloadType: 'PAYMENT_CANCEL_PAYLOAD',
      } as PaymentCancelRequestTaskActionPayload,
    };
  }

  private createMarkAsReceivedAction(
    payload: PaymentMarkAsReceivedRequestTaskActionPayload,
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskActionType: 'PAYMENT_MARK_AS_RECEIVED',
      requestTaskId,
      requestTaskActionPayload: {
        ...payload,
        payloadType: 'PAYMENT_MARK_AS_RECEIVED_PAYLOAD',
      } as PaymentMarkAsReceivedRequestTaskActionPayload,
    };
  }

  save(payload: PaymentTaskPayload): Observable<PaymentTaskPayload> {
    const { paymentMethod } = payload;
    const taskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    switch (paymentMethod) {
      case 'BANK_TRANSFER':
        return of(payload);
      case 'CREDIT_OR_DEBIT_CARD':
        return this.paymentsService.createCardPayment(taskId).pipe(
          catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
            this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
          ),
          catchTaskReassignedBadRequest(() =>
            this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
          ),
          this.pendingRequestService.trackRequest(),
          map((response: CardPaymentCreateResponseDTO) => ({
            ...payload,
            ...response,
          })),
        );
      default:
        throw 'Not supported payment method';
    }
  }

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
      tap(() => {
        const currentPayload = this.store.select(paymentQuery.selectPayload)();

        this.store.setPayload({
          ...currentPayload,
          status: 'MARK_AS_PAID',
        } as PaymentTaskPayload);
      }),
    );
  }

  cancel(payload: PaymentCancelRequestTaskActionPayload): Observable<void> {
    return this.service.processRequestTaskAction(this.createCancelAction(payload)).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  markAsReceived(payload: PaymentMarkAsReceivedRequestTaskActionPayload) {
    return this.service.processRequestTaskAction(this.createMarkAsReceivedAction(payload)).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  loadExistingCardProcessInfo(): Observable<PaymentTaskPayload> {
    const taskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    return this.paymentsService.processExistingCardPayment(taskId).pipe(
      this.pendingRequestService.trackRequest(),
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      map((response: CardPaymentProcessResponseDTO) => {
        const payload = this.store.select(paymentQuery.selectPayload)();

        const cartPaymentStatus = response?.state?.status;

        const result = {
          ...payload,
          ...response,
          status:
            cartPaymentStatus === 'success' ? 'COMPLETED' : cartPaymentStatus === 'cancelled' ? 'CANCELLED' : undefined,
          paymentMethod: 'CREDIT_OR_DEBIT_CARD',
        };

        this.store.setPayload(result);

        return result as PaymentTaskPayload;
      }),
    );
  }
}
