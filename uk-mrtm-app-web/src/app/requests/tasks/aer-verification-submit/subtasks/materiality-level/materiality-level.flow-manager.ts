import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { MATERIALITY_LEVEL_SUB_TASK, MaterialityLevelStep } from '@requests/common/aer';

export class MaterialityLevelFlowManager extends WizardFlowManager {
  readonly subtask = MATERIALITY_LEVEL_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case MaterialityLevelStep.DETAILS:
        return of(`../${MaterialityLevelStep.REFERENCE_DOCUMENTS}`);

      case MaterialityLevelStep.REFERENCE_DOCUMENTS:
        return of(MaterialityLevelStep.SUMMARY);

      default:
        return of('../../');
    }
  }
}
