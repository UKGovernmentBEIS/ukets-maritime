import { RequestActionUserInfo } from '@mrtm/api';

import { AttachedFile } from '@shared/types';

export interface OfficialNoticeInfo {
  users: string[];
  signatory: RequestActionUserInfo;
  officialNotice: AttachedFile[];
}
