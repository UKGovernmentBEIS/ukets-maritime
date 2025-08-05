import { PaymentProcessedRequestActionPayload } from '@mrtm/api';

import { createDescendingSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

const selectPayload: StateSelector<RequestActionState, PaymentProcessedRequestActionPayload> = createDescendingSelector(
  requestActionQuery.selectActionPayload,
  (payload) => payload as PaymentProcessedRequestActionPayload,
);

export const paymentActionQuery = {
  selectPayload,
};
