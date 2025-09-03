import { MrtmRequestTaskActionType } from '@shared/types';

export const PAYMENT_HINT_MAP: Partial<Record<MrtmRequestTaskActionType, string>> = {
  EMP_ISSUANCE_MAKE_PAYMENT: 'Your application cannot be processed until this payment is received.',
  EMP_ISSUANCE_CONFIRM_PAYMENT: 'The application cannot be reviewed until payment is received.',
  EMP_ISSUANCE_TRACK_PAYMENT: 'The application cannot be reviewed until payment is received.',
  DOE_MAKE_PAYMENT: 'Your application cannot be processed until this payment is received.',
  DOE_CONFIRM_PAYMENT: 'The application cannot be reviewed until payment is received.',
  DOE_TRACK_PAYMENT: 'The application cannot be reviewed until payment is received.',
  EMP_VARIATION_MAKE_PAYMENT: 'Your application cannot be processed until this payment is received.',
  EMP_VARIATION_CONFIRM_PAYMENT: 'The application cannot be reviewed until payment is received.',
  EMP_VARIATION_TRACK_PAYMENT: 'The application cannot be reviewed until payment is received.',
  EMP_VARIATION_REGULATOR_LED_MAKE_PAYMENT: 'Your application cannot be processed until this payment is received.',
  EMP_VARIATION_REGULATOR_LED_CONFIRM_PAYMENT: 'The application cannot be reviewed until payment is received.',
  EMP_VARIATION_REGULATOR_LED_TRACK_PAYMENT: 'The application cannot be reviewed until payment is received.',
};
