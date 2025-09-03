import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ManagementProceduresWizardStep } from '@requests/common/emp/subtasks/management-procedures';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-review/emp-review.helper';

export class MandateDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = MANDATE_SUB_TASK;
  step = ManagementProceduresWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(MANDATE_SUB_TASK);
}
