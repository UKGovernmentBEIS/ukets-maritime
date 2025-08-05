import { RfiSubmitPayload } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RfiSubmitDto extends Omit<RfiSubmitPayload, 'files'> {
  files?: Array<AttachedFile>;
}
