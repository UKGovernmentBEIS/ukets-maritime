import { NonComplianceCloseJustification } from '@mrtm/api';

import { UploadedFile } from '@shared/types';

export type NonComplianceCloseFormGroupData = Omit<NonComplianceCloseJustification, 'files'> & {
  files: UploadedFile[];
};
