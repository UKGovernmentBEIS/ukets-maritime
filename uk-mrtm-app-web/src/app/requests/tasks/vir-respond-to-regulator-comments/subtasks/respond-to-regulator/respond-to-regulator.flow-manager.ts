import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToRegulatorWizardStep } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator/respond-to-regulator.helpers';

export class RespondToRegulatorFlowManager extends WizardFlowManager {
  subtask: string = RESPOND_TO_REGULATOR_SUBTASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VirRespondToRegulatorWizardStep.FORM:
        return of(`../`);
      case VirRespondToRegulatorWizardStep.SUMMARY:
      default:
        return of('../../../');
    }
  }
}
