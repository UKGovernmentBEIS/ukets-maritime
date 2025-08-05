import { isNil } from 'lodash-es';

import { OperatorImprovementResponse } from '@mrtm/api';

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

export const wizardStepCompletedMap: Record<
  keyof Omit<typeof VirRespondToRecommendationWizardStep, 'SUMMARY'>,
  (operatorResponse: OperatorImprovementResponse) => boolean
> = {
  RESPOND_TO: isRespondToStepCompleted,
  UPLOAD_EVIDENCE_QUESTION: isUploadEvidenceQuestionCompleted,
  UPLOAD_EVIDENCE_FORM: isUploadEvidenceFormCompleted,
};

export const isWizardCompleted = (operatorResponse: OperatorImprovementResponse): boolean => {
  for (const key of Object.keys(wizardStepCompletedMap)) {
    if (!wizardStepCompletedMap[key](operatorResponse)) {
      return false;
    }
  }

  return true;
};
