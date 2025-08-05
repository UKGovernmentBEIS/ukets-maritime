import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import {
  REPORTING_OBLIGATION_SUB_TASK,
  ReportingObligationWizardStep,
} from '@requests/common/aer/subtasks/reporting-obligation';

export class ReportingObligationFlowManager extends WizardFlowManager {
  override subtask = REPORTING_OBLIGATION_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case ReportingObligationWizardStep.FORM:
        return of(ReportingObligationWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
