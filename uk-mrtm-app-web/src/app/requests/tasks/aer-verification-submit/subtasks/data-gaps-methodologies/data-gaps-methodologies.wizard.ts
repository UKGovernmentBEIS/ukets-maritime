import { isNil } from 'lodash-es';

import { AerDataGapsMethodologies } from '@mrtm/api';

export const isWizardCompleted = (dataGapsMethodologies: AerDataGapsMethodologies): boolean => {
  if (isMethodRequiredStepCompleted(dataGapsMethodologies)) {
    if (dataGapsMethodologies?.methodRequired === false) {
      return true;
    }
    if (isMethodApprovedStepCompleted(dataGapsMethodologies)) {
      if (dataGapsMethodologies?.methodApproved === true) {
        return true;
      }
      if (
        isMethodConservativeStepCompleted(dataGapsMethodologies) &&
        isMaterialMisstatementStepCompleted(dataGapsMethodologies)
      ) {
        return true;
      }
    }
  }

  return false;
};

const isMethodRequiredStepCompleted = (dataGapsMethodologies: AerDataGapsMethodologies): boolean =>
  !isNil(dataGapsMethodologies?.methodRequired);

const isMethodApprovedStepCompleted = (dataGapsMethodologies: AerDataGapsMethodologies): boolean =>
  !isNil(dataGapsMethodologies?.methodApproved);

const isMethodConservativeStepCompleted = (dataGapsMethodologies: AerDataGapsMethodologies): boolean =>
  dataGapsMethodologies?.methodConservative === true ||
  (dataGapsMethodologies?.methodConservative === false && !!dataGapsMethodologies?.noConservativeMethodDetails);

const isMaterialMisstatementStepCompleted = (dataGapsMethodologies: AerDataGapsMethodologies): boolean =>
  dataGapsMethodologies?.materialMisstatementExist === false ||
  (dataGapsMethodologies?.materialMisstatementExist === true && !!dataGapsMethodologies?.materialMisstatementDetails);
