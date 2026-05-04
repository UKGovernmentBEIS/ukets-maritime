import { RegistryRegulatorNoticeEventSubmittedRequestActionPayload } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RegistryNoticeEventSubmittedDto extends Omit<
  RegistryRegulatorNoticeEventSubmittedRequestActionPayload,
  'officialNotice'
> {
  officialNotice?: AttachedFile;
}
