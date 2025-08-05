import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class GreenhouseGasVariationReviewDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = GREENHOUSE_GAS_SUB_TASK;
  step = GreenhouseGasWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(GREENHOUSE_GAS_SUB_TASK);
}
