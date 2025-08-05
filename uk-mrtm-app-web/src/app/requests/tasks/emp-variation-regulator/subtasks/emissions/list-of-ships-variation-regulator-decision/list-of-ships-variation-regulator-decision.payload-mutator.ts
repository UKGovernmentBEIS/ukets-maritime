import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { applyVariationRegulatorDecisionMutator } from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.helper';

export class ListOfShipsVariationRegulatorDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.VARIATION_REGULATOR_DECISION;

  override apply = applyVariationRegulatorDecisionMutator(EMISSIONS_SUB_TASK);
}
