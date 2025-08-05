import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { UNCORRECTED_MISSTATEMENTS_SUB_TASK, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class UncorrectedMisstatementsFlowManager extends WizardFlowManager {
  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;

  private readonly uncorrectedMisstatements = this.store.select(
    aerVerificationSubmitQuery.selectUncorrectedMisstatements,
  );

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case UncorrectedMisstatementsStep.EXIST_FORM:
        return this.uncorrectedMisstatements()?.exist
          ? of(`../${UncorrectedMisstatementsStep.ITEMS_LIST}`)
          : of(UncorrectedMisstatementsStep.SUMMARY);

      case UncorrectedMisstatementsStep.ITEM_FORM_ADD:
        return of(`../${UncorrectedMisstatementsStep.ITEMS_LIST}`);

      case UncorrectedMisstatementsStep.ITEM_FORM_EDIT:
      case UncorrectedMisstatementsStep.ITEM_DELETE:
        return of(`../../${UncorrectedMisstatementsStep.ITEMS_LIST}`);

      case UncorrectedMisstatementsStep.ITEMS_LIST:
        return of(UncorrectedMisstatementsStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
