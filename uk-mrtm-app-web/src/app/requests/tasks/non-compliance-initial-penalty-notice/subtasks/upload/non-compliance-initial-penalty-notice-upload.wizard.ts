import { NonComplianceInitialPenaltyNoticeUpload } from '@requests/common/non-compliance';

export const isWizardCompleted = (initialPenaltyNoticeUpload: NonComplianceInitialPenaltyNoticeUpload): boolean => {
  return !!initialPenaltyNoticeUpload?.initialPenaltyNotice;
};
