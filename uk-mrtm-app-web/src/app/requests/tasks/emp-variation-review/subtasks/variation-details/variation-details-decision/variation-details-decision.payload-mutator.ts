import { PayloadMutator } from '@netz/common/forms';

import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { applyVariationDetailsReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class VariationDetailsDecisionPayloadMutator extends PayloadMutator {
  subtask = VARIATION_DETAILS_SUB_TASK;
  step = VariationDetailsWizardStep.DECISION;

  override apply = applyVariationDetailsReviewDecisionMutator;
}
