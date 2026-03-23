import { isNil } from 'lodash-es';

import { EmpVariationDetails, EmpVariationRegulatorLedReason } from '@mrtm/api';

export const isVariationDetailsWizardCompleted = (details: EmpVariationDetails): boolean =>
  !isNil(details?.reason) && details?.changes?.length > 0;

export const isVariationRegulatorDetailsWizardCompleted = (
  details: EmpVariationDetails,
  reasonRegulatorLed: EmpVariationRegulatorLedReason,
): boolean =>
  !isNil(details?.reason) &&
  details?.changes?.length > 0 &&
  !isNil(reasonRegulatorLed?.type) &&
  !isNil(reasonRegulatorLed?.summary);
