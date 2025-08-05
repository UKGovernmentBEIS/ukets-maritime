import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import { applyVariationRegulatorDecisionMutator } from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.helper';

export class AdditionalDocumentsVariationRegulatorDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = ADDITIONAL_DOCUMENTS_SUB_TASK;
  step = AdditionalDocumentsWizardStep.VARIATION_REGULATOR_DECISION;

  override apply = applyVariationRegulatorDecisionMutator(ADDITIONAL_DOCUMENTS_SUB_TASK);
}
