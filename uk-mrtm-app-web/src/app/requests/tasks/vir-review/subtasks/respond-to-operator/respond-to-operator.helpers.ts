import { isNil } from 'lodash-es';

import { RegulatorImprovementResponse } from '@mrtm/api';

export enum VirRespondToOperatorWizardStep {
  SUMMARY = '../',
  RESPOND_TO = 'respond-to',
}

export const isWizardCompleted = (regulatorResponse: RegulatorImprovementResponse): boolean =>
  !isNil(regulatorResponse?.improvementRequired) &&
  !isNil(regulatorResponse?.operatorActions) &&
  ((regulatorResponse?.improvementRequired === true && !isNil(regulatorResponse?.improvementDeadline)) ||
    regulatorResponse?.improvementRequired === false);
