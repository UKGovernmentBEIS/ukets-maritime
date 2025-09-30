import { PaymentProcessedRequestActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { PaymentTaskPayload } from '@requests/tasks/payment/payment.types';

const selectPayload: StateSelector<RequestTaskState, PaymentTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectYear: StateSelector<RequestTaskState, string> = createDescendingSelector(
  requestTaskQuery.selectRequestMetadata,
  (metadata: any) => metadata?.year,
);

const selectAvailablePaymentMethods: StateSelector<RequestTaskState, PaymentTaskPayload['paymentMethodTypes']> =
  createDescendingSelector(selectPayload, (payload) => payload?.paymentMethodTypes ?? []);

const selectPaymentMethod: StateSelector<RequestTaskState, PaymentTaskPayload['paymentMethod']> =
  createDescendingSelector(selectPayload, (payload) => payload?.paymentMethod);

const selectRedirectUrl: StateSelector<RequestTaskState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.nextUrl,
);

const selectExternalPaymentId: StateSelector<RequestTaskState, PaymentTaskPayload['externalPaymentId']> =
  createDescendingSelector(selectPayload, (payload) => payload?.externalPaymentId);

const selectPendingPaymentExist: StateSelector<RequestTaskState, PaymentTaskPayload['pendingPaymentExist']> =
  createDescendingSelector(selectPayload, (payload) => payload?.pendingPaymentExist);

const selectPaymentSummary: StateSelector<RequestTaskState, PaymentProcessedRequestActionPayload> =
  createAggregateSelector(requestTaskQuery.selectAssigneeFullName, selectPayload, (assignee, payload) => ({
    paymentRefNum: payload?.paymentRefNum,
    paymentDate: new Date().toISOString(),
    paidByFullName: assignee,
    amount: payload?.amount,
    status: payload?.status,
    paymentMethod: payload?.paymentMethod,
  }));

export const paymentQuery = {
  selectPayload,
  selectAvailablePaymentMethods,
  selectPaymentMethod,
  selectYear,
  selectPaymentSummary,
  selectRedirectUrl,
  selectPendingPaymentExist,
  selectExternalPaymentId,
};
