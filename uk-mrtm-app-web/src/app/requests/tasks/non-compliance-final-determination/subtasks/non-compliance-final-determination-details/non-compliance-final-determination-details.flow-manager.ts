import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NonComplianceFinalDeterminationDetailsStep,
} from '@requests/common/non-compliance';

export class NonComplianceFinalDeterminationDetailsFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case NonComplianceFinalDeterminationDetailsStep.DETAILS_FORM:
        return of(NonComplianceFinalDeterminationDetailsStep.SUMMARY);

      case NonComplianceFinalDeterminationDetailsStep.SUMMARY:
        return of('./');

      default:
        return of('../../');
    }
  }
}
