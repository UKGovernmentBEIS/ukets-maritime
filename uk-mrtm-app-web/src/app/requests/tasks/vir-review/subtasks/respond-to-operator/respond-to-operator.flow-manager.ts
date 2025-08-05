import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { RESPOND_TO_OPERATOR_SUBTASK } from '@requests/common/vir';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';

export class RespondToOperatorFlowManager extends WizardFlowManager {
  public readonly subtask: string = RESPOND_TO_OPERATOR_SUBTASK;

  public nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VirRespondToOperatorWizardStep.RESPOND_TO:
        return of(`../`);
      case VirRespondToOperatorWizardStep.SUMMARY:
        return of('../../../');
      default:
        return of('../../');
    }
  }
}
