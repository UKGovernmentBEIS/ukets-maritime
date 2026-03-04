import { RdePayload } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const isRdeFormCompleted = (rdePayload: RdePayload): boolean =>
  !isNil(rdePayload?.deadline) && !isNil(rdePayload?.extensionDate);

export const isRdeNotificationCompleted = (rdePayload: RdePayload): boolean => !isNil(rdePayload?.signatory);

export const isRdeSubmitCompleted = (rdePayload: RdePayload): boolean =>
  isRdeFormCompleted(rdePayload) && isRdeNotificationCompleted(rdePayload);
