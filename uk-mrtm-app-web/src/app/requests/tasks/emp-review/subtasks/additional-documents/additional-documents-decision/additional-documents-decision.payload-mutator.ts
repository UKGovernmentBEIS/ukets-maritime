import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
} from '@requests/common/utils/additional-documents';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-review/emp-review.helper';

export class AdditionalDocumentsDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = ADDITIONAL_DOCUMENTS_SUB_TASK;
  step = AdditionalDocumentsWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(ADDITIONAL_DOCUMENTS_SUB_TASK);
}
