import { NonComplianceNoticeOfIntentUpload } from '@requests/common/non-compliance';

export const isWizardCompleted = (noticeOfIntentUpload: NonComplianceNoticeOfIntentUpload): boolean => {
  return !!noticeOfIntentUpload?.noticeOfIntent;
};
