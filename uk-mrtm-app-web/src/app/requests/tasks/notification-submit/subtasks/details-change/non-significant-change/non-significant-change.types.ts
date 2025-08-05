import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import { UploadedFile } from '@shared/types';

export type NonSignificantChangeFormType = Omit<EmpNotificationDetailsOfChange, 'documents'> & {
  documents: UploadedFile[];
};
