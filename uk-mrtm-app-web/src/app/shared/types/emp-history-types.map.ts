import { MrtmRequestType } from '@shared/types';

export const empHistoryTypesMap: Record<MrtmRequestType, string> = {
  // Values must be in alphabetical order
  ACCOUNT_CLOSURE: 'Account closure',
  EMP_ISSUANCE: 'Application',
  EMP_REISSUE: 'Batch variation',
  EMP_NOTIFICATION: 'Notification',
  EMP_VARIATION: 'Variation',
};
