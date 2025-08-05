import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { ETS_COMPLIANCE_RULES_SUB_TASK, EtsComplianceRulesStep } from '@requests/common/aer';

export class EtsComplianceRulesFlowManager extends WizardFlowManager {
  readonly subtask = ETS_COMPLIANCE_RULES_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case EtsComplianceRulesStep.FORM:
        return of(EtsComplianceRulesStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
