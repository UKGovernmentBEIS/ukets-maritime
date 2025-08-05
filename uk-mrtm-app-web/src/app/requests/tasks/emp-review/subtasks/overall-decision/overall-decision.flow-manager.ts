import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionFlowManager extends WizardFlowManager {
  override subtask = OVERALL_DECISION_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS:
        return of(`../${OverallDecisionWizardStep.OVERALL_DECISION_QUESTION}`);
      case OverallDecisionWizardStep.OVERALL_DECISION_QUESTION:
        return of(OverallDecisionWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
