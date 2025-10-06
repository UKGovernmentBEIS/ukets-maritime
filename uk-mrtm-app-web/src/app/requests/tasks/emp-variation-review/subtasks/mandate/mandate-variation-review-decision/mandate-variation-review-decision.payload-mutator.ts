import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class MandateVariationReviewDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = MANDATE_SUB_TASK;
  step = MandateWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(MANDATE_SUB_TASK);
}
