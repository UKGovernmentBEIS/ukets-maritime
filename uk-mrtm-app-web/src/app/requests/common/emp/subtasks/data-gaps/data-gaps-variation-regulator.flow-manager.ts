import { Observable, of } from 'rxjs';

import { EmissionsMonitoringPlan } from '@mrtm/api';

import { WizardFlowManager } from '@netz/common/forms';

import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps/data-gaps.helper';

export class DataGapsVariationRegulatorFlowManager extends WizardFlowManager {
  override subtask: keyof EmissionsMonitoringPlan = DATA_GAPS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case DataGapsWizardStep.DATA_GAPS_METHOD:
        return of(`../${DataGapsWizardStep.VARIATION_REGULATOR_DECISION}`);
      case DataGapsWizardStep.VARIATION_REGULATOR_DECISION:
        return of(DataGapsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
