import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { applyVariationRegulatorDecisionMutator } from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.helper';

export class EmissionSourcesVariationRegulatorDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = EMISSION_SOURCES_SUB_TASK;
  step = EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION;

  override apply = applyVariationRegulatorDecisionMutator(EMISSION_SOURCES_SUB_TASK);
}
