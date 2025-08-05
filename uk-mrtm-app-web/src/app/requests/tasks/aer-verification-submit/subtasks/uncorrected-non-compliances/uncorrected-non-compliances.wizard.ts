import { AerUncorrectedNonCompliances } from '@mrtm/api';

import { UncorrectedNonCompliancesStep } from '@requests/common/aer';

export const isWizardCompleted = (uncorrectedNonCompliances: AerUncorrectedNonCompliances): boolean => {
  return (
    isUncorrectedNonCompliancesExistCompleted(uncorrectedNonCompliances) &&
    isUncorrectedNonCompliancesListCompleted(uncorrectedNonCompliances)
  );
};

export const getNextIncompleteStep = (
  uncorrectedNonCompliances: AerUncorrectedNonCompliances,
): UncorrectedNonCompliancesStep => {
  if (!isUncorrectedNonCompliancesExistCompleted(uncorrectedNonCompliances)) {
    return UncorrectedNonCompliancesStep.EXIST_FORM;
  } else if (!isUncorrectedNonCompliancesListCompleted(uncorrectedNonCompliances)) {
    return UncorrectedNonCompliancesStep.ITEMS_LIST;
  }

  return UncorrectedNonCompliancesStep.EXIST_FORM;
};

const isUncorrectedNonCompliancesExistCompleted = (uncorrectedNonCompliances: AerUncorrectedNonCompliances): boolean =>
  uncorrectedNonCompliances?.exist === false || uncorrectedNonCompliances?.exist === true;

export const isUncorrectedNonCompliancesListCompleted = (
  uncorrectedNonCompliances: AerUncorrectedNonCompliances,
): boolean =>
  uncorrectedNonCompliances?.exist === false ||
  (uncorrectedNonCompliances?.exist === true && uncorrectedNonCompliances?.uncorrectedNonCompliances?.length > 0);
