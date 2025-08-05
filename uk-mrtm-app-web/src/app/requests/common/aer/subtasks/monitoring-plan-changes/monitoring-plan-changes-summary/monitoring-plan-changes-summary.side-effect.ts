import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class MonitoringPlanChangesSummarySideEffect extends SideEffect {
  step = null;
  readonly subtask = MONITORING_PLAN_CHANGES_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
