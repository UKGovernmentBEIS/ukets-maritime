import { FileInfoDTO } from '@mrtm/api';

export interface EmpBatchReissueTaskPayload {
  payloadType?: string;
  signatory?: string;
  signatoryName?: string;
  submitter?: string;
  summary?: string;
  numberOfAccounts?: number;
  report?: FileInfoDTO;
  document?: FileInfoDTO;
  officialNotice?: FileInfoDTO;
}
