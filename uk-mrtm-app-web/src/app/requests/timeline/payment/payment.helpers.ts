import { isNil } from 'lodash-es';

const PAYMENT_ACTIONS_MAP: Record<string, { title: string; suffix?: string }> = {
  PAYMENT_MARKED_AS_PAID: { title: 'Payment marked as paid', suffix: '(BACS)' },
  PAYMENT_MARKED_AS_RECEIVED: { title: 'Payment marked as received' },
  PAYMENT_CANCELLED: { title: 'Payment task cancelled' },
  PAYMENT_COMPLETED: { title: 'Payment completed' },
};

export const itemActionToPaymentTitleTransformer = (actionType: string, submitter?: string): string => {
  const text = PAYMENT_ACTIONS_MAP[actionType]?.title;
  const suffix = PAYMENT_ACTIONS_MAP[actionType]?.suffix;

  return `${!isNil(submitter) ? `${text} by ${submitter}` : `${text}`} ${!isNil(suffix) ? `${suffix}` : ''}`.trim();
};
