import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class UncorrectedNonConformitiesFlowManager extends WizardFlowManager {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;

  private readonly uncorrectedNonConformities = this.store.select(
    aerVerificationSubmitQuery.selectUncorrectedNonConformities,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case UncorrectedNonConformitiesStep.EXIST_FORM:
        return this.uncorrectedNonConformities()?.exist
          ? of(`../${UncorrectedNonConformitiesStep.ITEMS_LIST}`)
          : of(`../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM}`);

      case UncorrectedNonConformitiesStep.ITEM_FORM_ADD:
        return of(`../${UncorrectedNonConformitiesStep.ITEMS_LIST}`);

      case UncorrectedNonConformitiesStep.ITEM_FORM_EDIT:
      case UncorrectedNonConformitiesStep.ITEM_DELETE:
        return of(`../../${UncorrectedNonConformitiesStep.ITEMS_LIST}`);

      case UncorrectedNonConformitiesStep.ITEMS_LIST:
        return of(`../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM}`);

      case UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM:
        return this.uncorrectedNonConformities()?.existPriorYearIssues
          ? of(`../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST}`)
          : of(UncorrectedNonConformitiesStep.SUMMARY);

      case UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_ADD:
        return of(`../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST}`);

      case UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_EDIT:
      case UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_DELETE:
        return of(`../../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST}`);

      case UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST:
        return of(UncorrectedNonConformitiesStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
