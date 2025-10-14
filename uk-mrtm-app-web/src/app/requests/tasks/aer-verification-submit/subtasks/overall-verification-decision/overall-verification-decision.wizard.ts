import {
  AerNotVerifiedDecision,
  AerVerificationDecision,
  AerVerifiedSatisfactoryWithCommentsDecision,
} from '@mrtm/api';

export const isWizardCompleted = (overallDecision: AerVerificationDecision): boolean => {
  return isAssessmentStepCompleted(overallDecision) && isDecisionDetailsStepCompleted(overallDecision);
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
