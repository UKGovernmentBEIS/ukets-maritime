import { Observable, of } from 'rxjs';

import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmissionsBaseFlowManager } from '@requests/common/emp/subtasks/emissions/emissions-base.flow-manager';

export class EmissionsVariationRegulatorFlowManager extends EmissionsBaseFlowManager {
  protected override taskStepPath(currentStep: string): Observable<string> {
    return currentStep === EmissionsWizardStep.VARIATION_REGULATOR_DECISION
      ? of(EmissionsWizardStep.SUMMARY)
      : super.taskStepPath(currentStep);
  }
}
