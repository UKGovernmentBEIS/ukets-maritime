import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';

export class VariationDetailsReviewFlowManager extends WizardFlowManager {
  override subtask: keyof EmpVariationReviewTaskPayload = VARIATION_DETAILS_SUB_TASK;

  nextStepPath(currentStep: string): Observable<string> {
    switch (currentStep) {
      case VariationDetailsWizardStep.DESCRIBE_CHANGES:
        return of(`../${VariationDetailsWizardStep.DECISION}`);
      case VariationDetailsWizardStep.DECISION:
        return of(VariationDetailsWizardStep.SUMMARY);
      default:
        return of('../../');
    }
  }
}
