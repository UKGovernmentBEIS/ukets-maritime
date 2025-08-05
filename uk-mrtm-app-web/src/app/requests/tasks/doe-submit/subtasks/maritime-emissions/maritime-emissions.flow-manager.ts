import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions.helper';

export class MaritimeEmissionsFlowManager extends WizardFlowManager {
  override subtask = MARITIME_EMISSIONS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case MaritimeEmissionsWizardStep.DETERMINATION_REASON:
        return of(`../${MaritimeEmissionsWizardStep.TOTAL_MARITIME_EMISSIONS}`);
      case MaritimeEmissionsWizardStep.TOTAL_MARITIME_EMISSIONS:
        return of(`../${MaritimeEmissionsWizardStep.CHARGE_OPERATOR}`);
      case MaritimeEmissionsWizardStep.CHARGE_OPERATOR: {
        const chargeOperator = this.store.select(doeSubmitQuery.selectChargeOperator)();
        return chargeOperator === true
          ? of(`../${MaritimeEmissionsWizardStep.FEE_DETAILS}`)
          : of(MaritimeEmissionsWizardStep.SUMMARY);
      }
      case MaritimeEmissionsWizardStep.FEE_DETAILS:
        return of(MaritimeEmissionsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
