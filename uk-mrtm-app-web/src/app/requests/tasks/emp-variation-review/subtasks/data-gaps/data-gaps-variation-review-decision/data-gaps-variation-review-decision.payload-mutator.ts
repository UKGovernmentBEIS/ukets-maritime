import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class DataGapsVariationReviewDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = DATA_GAPS_SUB_TASK;
  step = DataGapsWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(DATA_GAPS_SUB_TASK);
}
