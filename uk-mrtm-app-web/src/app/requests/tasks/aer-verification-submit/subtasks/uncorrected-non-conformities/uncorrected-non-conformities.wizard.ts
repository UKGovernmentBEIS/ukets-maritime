import { AerUncorrectedNonConformities } from '@mrtm/api';

export const isWizardCompleted = (uncorrectedNonConformities: AerUncorrectedNonConformities): boolean => {
  return (
    isUncorrectedNonConformitiesExistCompleted(uncorrectedNonConformities) &&
    isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities) &&
    isPriorYearIssuesExistCompleted(uncorrectedNonConformities) &&
    isPriorYearIssuesListCompleted(uncorrectedNonConformities)
  );
};

const isUncorrectedNonConformitiesExistCompleted = (
  uncorrectedNonConformities: AerUncorrectedNonConformities,
): boolean => uncorrectedNonConformities?.exist === false || uncorrectedNonConformities?.exist === true;

export const isUncorrectedNonConformitiesListCompleted = (
  uncorrectedNonConformities: AerUncorrectedNonConformities,
): boolean =>
  uncorrectedNonConformities?.exist === false ||
  (uncorrectedNonConformities?.exist === true && uncorrectedNonConformities?.uncorrectedNonConformities?.length > 0);

const isPriorYearIssuesExistCompleted = (uncorrectedNonConformities: AerUncorrectedNonConformities): boolean =>
  uncorrectedNonConformities?.existPriorYearIssues === false ||
  uncorrectedNonConformities?.existPriorYearIssues === true;

const isPriorYearIssuesListCompleted = (uncorrectedNonConformities: AerUncorrectedNonConformities): boolean =>
  uncorrectedNonConformities?.existPriorYearIssues === false ||
  (uncorrectedNonConformities?.existPriorYearIssues === true &&
    uncorrectedNonConformities?.priorYearIssues?.length > 0);
