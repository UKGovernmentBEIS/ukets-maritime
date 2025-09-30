import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { NON_COMPLIANCE_AMEND_DETAILS_SUB_TASK } from '@requests/common/non-compliance/non-compliance-amend-details/non-compliance-amend-details.const';

export class NonComplianceAmendDetailsFlowManager extends WizardFlowManager {
  readonly subtask = NON_COMPLIANCE_AMEND_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      default:
        return of('../');
    }
  }
}
