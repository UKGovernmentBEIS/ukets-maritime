import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerMonitoringPlanChanges } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MonitoringPlanChangesWizardStep,
} from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class MonitoringPlanChangesFormPayloadMutator extends PayloadMutator {
  readonly subtask = MONITORING_PLAN_CHANGES_SUB_TASK;
  step = MonitoringPlanChangesWizardStep.FORM;

  apply(currentPayload: AerSubmitTaskPayload, userInput: AerMonitoringPlanChanges): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aer[this.subtask] = userInput;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
