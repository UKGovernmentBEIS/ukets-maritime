import { AerSmfPurchase } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface ReductionClaimDetailsListItemDto extends Partial<Omit<AerSmfPurchase, 'evidenceFiles'>> {
  evidenceFiles?: Array<AttachedFile>;
}
