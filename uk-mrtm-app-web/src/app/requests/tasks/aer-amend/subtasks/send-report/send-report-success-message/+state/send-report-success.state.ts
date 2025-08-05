import { VerificationBodyNameInfoDTO } from '@mrtm/api';

export interface SendReportSuccessState {
  verificationBodyNameInfo: VerificationBodyNameInfoDTO;
}

export const initialSendReportSuccessState: SendReportSuccessState = {
  verificationBodyNameInfo: null,
};
