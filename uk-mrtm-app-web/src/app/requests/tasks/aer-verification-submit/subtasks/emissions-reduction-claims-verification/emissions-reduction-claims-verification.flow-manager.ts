import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
  EmissionsReductionClaimsVerificationStep,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';

export class EmissionsReductionClaimsVerificationFlowManager extends WizardFlowManager {
  readonly subtask = EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case EmissionsReductionClaimsVerificationStep.FORM:
        return of(EmissionsReductionClaimsVerificationStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
