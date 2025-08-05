import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { applyVariationRegulatorDecisionMutator } from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.helper';

export class AbbreviationsVariationRegulatorDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = ABBREVIATIONS_SUB_TASK;
  step = AbbreviationsWizardStep.VARIATION_REGULATOR_DECISION;

  override apply = applyVariationRegulatorDecisionMutator(ABBREVIATIONS_SUB_TASK);
}
