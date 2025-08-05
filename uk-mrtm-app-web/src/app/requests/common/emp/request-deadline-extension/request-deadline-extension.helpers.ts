import { isNil } from 'lodash-es';

import { RdePayload } from '@mrtm/api';

export const isRdeFormCompleted = (rdePayload: RdePayload): boolean =>
  !isNil(rdePayload?.deadline) && !isNil(rdePayload?.extensionDate);

export const isRdeNotificationCompleted = (rdePayload: RdePayload): boolean => !isNil(rdePayload?.signatory);

export const isRdeSubmitCompleted = (rdePayload: RdePayload): boolean =>
  isRdeFormCompleted(rdePayload) && isRdeNotificationCompleted(rdePayload);
