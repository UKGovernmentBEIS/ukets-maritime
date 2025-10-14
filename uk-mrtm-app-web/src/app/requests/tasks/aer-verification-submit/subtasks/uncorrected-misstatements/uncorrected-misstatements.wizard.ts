import { AerUncorrectedMisstatements } from '@mrtm/api';

export const isWizardCompleted = (uncorrectedMisstatements: AerUncorrectedMisstatements): boolean => {
  return (
    isUncorrectedMisstatementsExistCompleted(uncorrectedMisstatements) &&
    isUncorrectedMisstatementsListCompleted(uncorrectedMisstatements)
  );
};

const isUncorrectedMisstatementsExistCompleted = (uncorrectedMisstatements: AerUncorrectedMisstatements): boolean =>
  uncorrectedMisstatements?.exist === false || uncorrectedMisstatements?.exist === true;

export const isUncorrectedMisstatementsListCompleted = (
  uncorrectedMisstatements: AerUncorrectedMisstatements,
): boolean =>
  uncorrectedMisstatements?.exist === false ||
  (uncorrectedMisstatements?.exist === true && uncorrectedMisstatements?.uncorrectedMisstatements?.length > 0);
