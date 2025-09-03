import { NonComplianceCivilPenaltyUpload } from '@requests/common/non-compliance';

export const isWizardCompleted = (civilPenaltyUpload: NonComplianceCivilPenaltyUpload): boolean => {
  return !!civilPenaltyUpload?.civilPenalty && !!civilPenaltyUpload.dueDate && !!civilPenaltyUpload.penaltyAmount;
};
