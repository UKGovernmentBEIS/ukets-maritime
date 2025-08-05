import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';

export class AerOperatorDetailsFlowManager extends WizardFlowManager {
  override subtask = OPERATOR_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM:
        return of(`../${OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION}`);
      case OperatorDetailsWizardStep.OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION:
        return of(`../${OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS}`);
      case OperatorDetailsWizardStep.OPERATOR_DETAILS_ORGANISATION_DETAILS:
        return of(OperatorDetailsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
