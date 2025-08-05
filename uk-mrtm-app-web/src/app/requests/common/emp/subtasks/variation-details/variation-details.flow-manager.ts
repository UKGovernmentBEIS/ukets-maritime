import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';

export class VariationDetailsFlowManager extends WizardFlowManager {
  override subtask: keyof EmpVariationTaskPayload = VARIATION_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VariationDetailsWizardStep.DESCRIBE_CHANGES:
        return of(VariationDetailsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
