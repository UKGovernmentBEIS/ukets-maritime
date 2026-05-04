import { NonComplianceDetails } from '@requests/common/non-compliance';
import { isNil } from '@shared/utils';

export const isWizardCompleted = (nonComplianceDetails: NonComplianceDetails): boolean => {
  return !!nonComplianceDetails?.reason && isEnforcementDetailsCompleted(nonComplianceDetails);
};

const isEnforcementDetailsCompleted = (nonComplianceDetails: NonComplianceDetails): boolean => {
  if (nonComplianceDetails?.civilPenalty) {
    return !isNil(nonComplianceDetails?.noticeOfIntent) && !isNil(nonComplianceDetails?.initialPenalty);
  } else if (nonComplianceDetails?.civilPenalty === false) {
    return !!nonComplianceDetails?.noCivilPenaltyJustification;
  }
  return false;
};
