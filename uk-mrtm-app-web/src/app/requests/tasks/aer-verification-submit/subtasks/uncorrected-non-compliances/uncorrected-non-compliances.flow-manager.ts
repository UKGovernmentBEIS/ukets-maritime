import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class UncorrectedNonCompliancesFlowManager extends WizardFlowManager {
  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;

  private readonly uncorrectedNonCompliances = this.store.select(
    aerVerificationSubmitQuery.selectUncorrectedNonCompliances,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case UncorrectedNonCompliancesStep.EXIST_FORM:
        return this.uncorrectedNonCompliances()?.exist
          ? of(`../${UncorrectedNonCompliancesStep.ITEMS_LIST}`)
          : of(UncorrectedNonCompliancesStep.SUMMARY);

      case UncorrectedNonCompliancesStep.ITEM_FORM_ADD:
        return of(`../${UncorrectedNonCompliancesStep.ITEMS_LIST}`);

      case UncorrectedNonCompliancesStep.ITEM_FORM_EDIT:
      case UncorrectedNonCompliancesStep.ITEM_DELETE:
        return of(`../../${UncorrectedNonCompliancesStep.ITEMS_LIST}`);

      case UncorrectedNonCompliancesStep.ITEMS_LIST:
        return of(UncorrectedNonCompliancesStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
