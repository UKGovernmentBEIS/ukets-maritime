import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';

export class AerTotalEmissionsFlowManager extends WizardFlowManager {
  readonly subtask = AER_TOTAL_EMISSIONS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      default:
        return of('../../');
    }
  }
}
