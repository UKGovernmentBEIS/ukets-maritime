import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { DATA_GAPS_METHODOLOGIES_SUB_TASK, DataGapsMethodologiesStep } from '@requests/common/aer';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export class DataGapsMethodologiesFlowManager extends WizardFlowManager {
  readonly subtask = DATA_GAPS_METHODOLOGIES_SUB_TASK;

  private readonly dataGapsMethodologies = this.store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies);

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case DataGapsMethodologiesStep.METHOD_REQUIRED:
        return this.dataGapsMethodologies()?.methodRequired
          ? of(`../${DataGapsMethodologiesStep.METHOD_APPROVED}`)
          : of(DataGapsMethodologiesStep.SUMMARY);

      case DataGapsMethodologiesStep.METHOD_APPROVED:
        return this.dataGapsMethodologies()?.methodApproved
          ? of(DataGapsMethodologiesStep.SUMMARY)
          : of(`../${DataGapsMethodologiesStep.METHOD_CONSERVATIVE}`);

      case DataGapsMethodologiesStep.METHOD_CONSERVATIVE:
        return of(`../${DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT}`);

      case DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT:
        return of(DataGapsMethodologiesStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
