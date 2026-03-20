import { OperatorImprovementFollowUpResponse } from '@mrtm/api';

import { isNil } from '@shared/utils';

export enum VirRespondToRegulatorWizardStep {
  SUMMARY = '../',
  FORM = 'form',
}

export const isWizardCompleted = (operatorResponse: OperatorImprovementFollowUpResponse): boolean =>
  !isNil(operatorResponse?.improvementCompleted) &&
  ((operatorResponse?.improvementCompleted === true && !isNil(operatorResponse?.dateCompleted)) ||
    (operatorResponse?.improvementCompleted === false && !isNil(operatorResponse?.reason)));
