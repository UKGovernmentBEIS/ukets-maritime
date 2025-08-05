import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-review/emp-review.helper';

export class OperatorDetailsDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = OPERATOR_DETAILS_SUB_TASK;
  step = OperatorDetailsWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(OPERATOR_DETAILS_SUB_TASK);
}
