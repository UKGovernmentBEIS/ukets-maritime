import { RdeForceDecisionPayload } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface RdeForceDecision extends Omit<RdeForceDecisionPayload, 'files'> {
  files: AttachedFile[];
}
