import { AerUncorrectedNonConformities } from '@mrtm/api';

import { UncorrectedNonConformitiesStep } from '@requests/common/aer';

export const isWizardCompleted = (uncorrectedNonConformities: AerUncorrectedNonConformities): boolean => {
  return (
    isUncorrectedNonConformitiesExistCompleted(uncorrectedNonConformities) &&
    isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities) &&
    isPriorYearIssuesExistCompleted(uncorrectedNonConformities) &&
    isPriorYearIssuesListCompleted(uncorrectedNonConformities)
  );
};

export const getNextIncompleteStep = (
  uncorrectedNonConformities: AerUncorrectedNonConformities,
): UncorrectedNonConformitiesStep => {
  if (!isUncorrectedNonConformitiesExistCompleted(uncorrectedNonConformities)) {
    return UncorrectedNonConformitiesStep.EXIST_FORM;
  } else if (!isUncorrectedNonConformitiesListCompleted(uncorrectedNonConformities)) {
    return UncorrectedNonConformitiesStep.ITEMS_LIST;
  } else if (!isPriorYearIssuesExistCompleted(uncorrectedNonConformities)) {
    return UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM;
  } else if (!isPriorYearIssuesListCompleted(uncorrectedNonConformities)) {
    return UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST;
  }

  return UncorrectedNonConformitiesStep.EXIST_FORM;
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
