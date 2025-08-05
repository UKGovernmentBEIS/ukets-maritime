import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { VERIFIER_DETAILS_SUB_TASK, VerifierDetailsStep } from '@requests/common/aer';

export class VerifierDetailsFlowManager extends WizardFlowManager {
  readonly subtask = VERIFIER_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VerifierDetailsStep.FORM:
        return of(VerifierDetailsStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
