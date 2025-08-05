import { PaymentMakeRequestTaskPayload, PaymentProcessedRequestActionPayload } from '@mrtm/api';

export type PaymentDetailsDto = Pick<
  PaymentMakeRequestTaskPayload & PaymentProcessedRequestActionPayload,
  'creationDate' | 'amount' | 'paymentRefNum' | 'paymentMethod' | 'status' | 'paidByFullName' | 'paymentDate'
>;
