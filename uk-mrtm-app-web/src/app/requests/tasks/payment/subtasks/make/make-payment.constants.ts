export const MAKE_PAYMENT_SUBTASK = 'make-payment';
export const MAKE_PAYMENT_ROUTE_PREFIX = 'make';

export enum MakePaymentWizardSteps {
  PAYMENT_METHOD = 'payment-method',
  BANK_TRANSFER = 'bank-transfer',
  BANK_TRANSFER_SUBMIT = 'submit',
  NOT_SUCCESS = 'not-success',
  CONFIRMATION = 'confirmation',
}
