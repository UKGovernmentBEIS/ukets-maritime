import { OperatorImprovementResponse } from '@mrtm/api';

import { isNil } from '@shared/utils';

export enum VirRespondToRecommendationWizardStep {
  SUMMARY = '../',
  RESPOND_TO = 'respond-to',
  UPLOAD_EVIDENCE_QUESTION = 'upload-evidence-question',
  UPLOAD_EVIDENCE_FORM = 'upload-evidence',
}

const isRespondToStepCompleted = (operatorResponse: OperatorImprovementResponse): boolean =>
  !isNil(operatorResponse?.isAddressed) &&
  !isNil(operatorResponse?.addressedDescription) &&
  (!operatorResponse?.isAddressed || (operatorResponse?.isAddressed && !!operatorResponse?.addressedDate));

const isUploadEvidenceQuestionCompleted = (operatorResponse: OperatorImprovementResponse): boolean =>
  !isNil(operatorResponse?.uploadEvidence);

const isUploadEvidenceFormCompleted = (operatorResponse: OperatorImprovementResponse): boolean =>
  operatorResponse?.uploadEvidence === false ||
  (operatorResponse?.uploadEvidence === true && operatorResponse?.files?.length > 0);

export const isWizardCompleted = (operatorResponse: OperatorImprovementResponse): boolean => {
  return (
    isRespondToStepCompleted(operatorResponse) &&
    isUploadEvidenceQuestionCompleted(operatorResponse) &&
    isUploadEvidenceFormCompleted(operatorResponse)
  );
};
