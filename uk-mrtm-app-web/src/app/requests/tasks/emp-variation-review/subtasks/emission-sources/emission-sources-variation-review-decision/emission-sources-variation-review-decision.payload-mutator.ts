import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-variation-review/emp-variation-review.helper';

export class EmissionSourcesVariationReviewDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = EMISSION_SOURCES_SUB_TASK;
  step = EmissionSourcesWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(EMISSION_SOURCES_SUB_TASK);
}
