import { RdePayload } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RdeSubmitted extends RdePayload {
  officialNotice: AttachedFile[];
}
