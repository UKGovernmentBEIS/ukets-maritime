import {
  AerNotVerifiedDecision,
  AerVerificationDecision,
  AerVerifiedSatisfactoryWithCommentsDecision,
} from '@mrtm/api';

import { OverallVerificationDecisionStep } from '@requests/common/aer';

export const isWizardCompleted = (overallDecision: AerVerificationDecision): boolean => {
  return isAssessmentStepCompleted(overallDecision) && isDecisionDetailsStepCompleted(overallDecision);
};

export const getNextIncompleteStep = (overallDecision: AerVerificationDecision): OverallVerificationDecisionStep => {
  if (!isAssessmentStepCompleted(overallDecision)) {
    return OverallVerificationDecisionStep.ASSESSMENT;
  }
  if (overallDecision?.type === 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS') {
    if (!isVerifiedCommentsStepCompleted(overallDecision)) {
      return OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST;
    }
  } else if (overallDecision?.type === 'NOT_VERIFIED') {
    if (!isNotVerifiedReasonsStepCompleted(overallDecision)) {
      return OverallVerificationDecisionStep.NOT_VERIFIED_REASONS;
    }
  }

  return OverallVerificationDecisionStep.ASSESSMENT;
};

const isAssessmentStepCompleted = (overallDecision: AerVerificationDecision): boolean => {
  return !!overallDecision?.type;
};

const isDecisionDetailsStepCompleted = (overallDecision: AerVerificationDecision): boolean => {
  switch (overallDecision?.type) {
    case 'VERIFIED_AS_SATISFACTORY':
      return true;

    case 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS':
      return isVerifiedCommentsStepCompleted(overallDecision);

    case 'NOT_VERIFIED':
      return isNotVerifiedReasonsStepCompleted(overallDecision);

    default:
      return false;
  }
};

const isVerifiedCommentsStepCompleted = (overallDecision: AerVerificationDecision): boolean => {
  return !!(overallDecision as AerVerifiedSatisfactoryWithCommentsDecision)?.reasons?.length;
};

const isNotVerifiedReasonsStepCompleted = (overallDecision: AerVerificationDecision): boolean => {
  return !!(overallDecision as AerNotVerifiedDecision)?.notVerifiedReasons?.length;
};
