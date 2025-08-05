import { EmissionsMonitoringPlan } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { applyReviewDecisionMutator } from '@requests/tasks/emp-review/emp-review.helper';

export class ControlActivitiesDecisionPayloadMutator extends PayloadMutator {
  subtask: keyof EmissionsMonitoringPlan = CONTROL_ACTIVITIES_SUB_TASK;
  step = ControlActivitiesWizardStep.DECISION;

  override apply = applyReviewDecisionMutator(CONTROL_ACTIVITIES_SUB_TASK);
}
