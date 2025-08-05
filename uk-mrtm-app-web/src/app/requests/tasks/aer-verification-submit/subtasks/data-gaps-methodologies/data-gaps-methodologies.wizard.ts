import { isNil } from 'lodash-es';

import { AerDataGapsMethodologies } from '@mrtm/api';

import { DataGapsMethodologiesStep } from '@requests/common/aer';

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

export const getNextIncompleteStep = (dataGapsMethodologies: AerDataGapsMethodologies): DataGapsMethodologiesStep => {
  if (!isMethodRequiredStepCompleted(dataGapsMethodologies)) {
    return DataGapsMethodologiesStep.METHOD_REQUIRED;
  } else if (!isMethodApprovedStepCompleted(dataGapsMethodologies)) {
    return DataGapsMethodologiesStep.METHOD_APPROVED;
  } else if (!isMethodConservativeStepCompleted(dataGapsMethodologies)) {
    return DataGapsMethodologiesStep.METHOD_CONSERVATIVE;
  } else if (!isMaterialMisstatementStepCompleted(dataGapsMethodologies)) {
    return DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT;
  }
  return DataGapsMethodologiesStep.METHOD_REQUIRED;
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
