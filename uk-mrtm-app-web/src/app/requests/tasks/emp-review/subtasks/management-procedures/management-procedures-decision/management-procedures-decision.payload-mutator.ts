import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-review/emp-review.helper';

export class ManagementProceduresDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = MANAGEMENT_PROCEDURES_SUB_TASK;
  step = ManagementProceduresWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(MANAGEMENT_PROCEDURES_SUB_TASK);
}
