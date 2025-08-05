import { PaymentProcessedRequestActionPayload } from '@mrtm/api';

import { GovukSelectOption } from '@netz/govuk-components';

export const PAYMENT_METHOD_SELECT_OPTIONS: Array<
  GovukSelectOption<PaymentProcessedRequestActionPayload['paymentMethod']>
> = [
  {
    value: 'CREDIT_OR_DEBIT_CARD',
    text: 'Debit card or credit card',
  },
  {
    value: 'BANK_TRANSFER',
    text: 'Bank transfer (BACS)',
  },
];
