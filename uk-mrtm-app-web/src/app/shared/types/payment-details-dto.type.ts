import {
  PaymentCancelledRequestActionPayload,
  PaymentMakeRequestTaskPayload,
  PaymentProcessedRequestActionPayload,
} from '@mrtm/api';

export type PaymentDetailsDto = Pick<
  PaymentMakeRequestTaskPayload & PaymentProcessedRequestActionPayload & PaymentCancelledRequestActionPayload,
  | 'creationDate'
  | 'amount'
  | 'paymentRefNum'
  | 'paymentMethod'
  | 'status'
  | 'paidByFullName'
  | 'paymentDate'
  | 'cancellationReason'
  | 'receivedDate'
>;
