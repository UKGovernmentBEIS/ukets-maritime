import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { applyVariationRegulatorDecisionMutator } from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.helper';

export class GreenhouseGasVariationRegulatorDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = GREENHOUSE_GAS_SUB_TASK;
  step = GreenhouseGasWizardStep.VARIATION_REGULATOR_DECISION;

  override apply = applyVariationRegulatorDecisionMutator(GREENHOUSE_GAS_SUB_TASK);
}
