import { PaymentMakeRequestTaskPayload } from '@mrtm/api';

export type PaymentBankAccountDetailsDto = Pick<
  PaymentMakeRequestTaskPayload,
  'amount' | 'bankAccountDetails' | 'paymentRefNum'
>;
