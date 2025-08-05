import { VerificationBodyNameInfoDTO } from '@mrtm/api';

import { createSelector, StateSelector } from '@netz/common/store';

import { SendReportSuccessState } from '@requests/tasks/aer-submit/subtasks/send-report/send-report-success-message/+state/send-report-success.state';

export const selectVerificationBodyNameInfo: StateSelector<SendReportSuccessState, VerificationBodyNameInfoDTO> =
  createSelector((state) => state.verificationBodyNameInfo);

export const sendReportSuccessQuery = {
  selectVerificationBodyNameInfo,
};
