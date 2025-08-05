import { AerUncorrectedMisstatements } from '@mrtm/api';

import { UncorrectedMisstatementsStep } from '@requests/common/aer';

export const isWizardCompleted = (uncorrectedMisstatements: AerUncorrectedMisstatements): boolean => {
  return (
    isUncorrectedMisstatementsExistCompleted(uncorrectedMisstatements) &&
    isUncorrectedMisstatementsListCompleted(uncorrectedMisstatements)
  );
};

export const getNextIncompleteStep = (
  uncorrectedMisstatements: AerUncorrectedMisstatements,
): UncorrectedMisstatementsStep => {
  if (!isUncorrectedMisstatementsExistCompleted(uncorrectedMisstatements)) {
    return UncorrectedMisstatementsStep.EXIST_FORM;
  } else if (!isUncorrectedMisstatementsListCompleted(uncorrectedMisstatements)) {
    return UncorrectedMisstatementsStep.ITEMS_LIST;
  }

  return UncorrectedMisstatementsStep.EXIST_FORM;
};

const isUncorrectedMisstatementsExistCompleted = (uncorrectedMisstatements: AerUncorrectedMisstatements): boolean =>
  uncorrectedMisstatements?.exist === false || uncorrectedMisstatements?.exist === true;

export const isUncorrectedMisstatementsListCompleted = (
  uncorrectedMisstatements: AerUncorrectedMisstatements,
): boolean =>
  uncorrectedMisstatements?.exist === false ||
  (uncorrectedMisstatements?.exist === true && uncorrectedMisstatements?.uncorrectedMisstatements?.length > 0);
