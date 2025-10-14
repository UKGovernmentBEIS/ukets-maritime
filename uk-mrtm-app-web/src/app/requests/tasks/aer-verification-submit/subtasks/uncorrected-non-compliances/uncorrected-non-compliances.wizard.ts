import { AerUncorrectedNonCompliances } from '@mrtm/api';

export const isWizardCompleted = (uncorrectedNonCompliances: AerUncorrectedNonCompliances): boolean => {
  return (
    isUncorrectedNonCompliancesExistCompleted(uncorrectedNonCompliances) &&
    isUncorrectedNonCompliancesListCompleted(uncorrectedNonCompliances)
  );
};

const isUncorrectedNonCompliancesExistCompleted = (uncorrectedNonCompliances: AerUncorrectedNonCompliances): boolean =>
  uncorrectedNonCompliances?.exist === false || uncorrectedNonCompliances?.exist === true;

export const isUncorrectedNonCompliancesListCompleted = (
  uncorrectedNonCompliances: AerUncorrectedNonCompliances,
): boolean =>
  uncorrectedNonCompliances?.exist === false ||
  (uncorrectedNonCompliances?.exist === true && uncorrectedNonCompliances?.uncorrectedNonCompliances?.length > 0);
