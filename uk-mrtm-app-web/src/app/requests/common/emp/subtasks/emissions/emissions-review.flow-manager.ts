import { Observable, of } from 'rxjs';

import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EmissionsBaseFlowManager } from '@requests/common/emp/subtasks/emissions/emissions-base.flow-manager';

export class EmissionsReviewFlowManager extends EmissionsBaseFlowManager {
  protected override taskStepPath(currentStep: string): Observable<string> {
    return currentStep === EmissionsWizardStep.DECISION
      ? of(EmissionsWizardStep.SUMMARY)
      : super.taskStepPath(currentStep);
  }
}
