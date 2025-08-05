import { isNil } from 'lodash-es';

import { RfiSubmitPayload } from '@mrtm/api';

export const isRfiFormCompleted = (rfiPayload: RfiSubmitPayload): boolean =>
  !isNil(rfiPayload?.deadline) && rfiPayload?.questions?.length > 0;

export const isRfiNotificationCompleted = (rfiPayload: RfiSubmitPayload): boolean => !isNil(rfiPayload?.signatory);

export const isRfiSubmitCompleted = (rfiPayload: RfiSubmitPayload): boolean =>
  isRfiFormCompleted(rfiPayload) && isRfiNotificationCompleted(rfiPayload);
