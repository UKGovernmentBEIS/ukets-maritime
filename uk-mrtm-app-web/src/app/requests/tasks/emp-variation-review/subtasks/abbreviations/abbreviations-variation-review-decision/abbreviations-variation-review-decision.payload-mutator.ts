import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class AbbreviationsVariationReviewDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = ABBREVIATIONS_SUB_TASK;
  step = AbbreviationsWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(ABBREVIATIONS_SUB_TASK);
}
