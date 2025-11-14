import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ControlActivitiesSummarySideEffect extends SideEffect {
  step = undefined;
  subtask = CONTROL_ACTIVITIES_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpIssuanceApplicationSubmitRequestTaskPayload,
  ): Observable<EmpIssuanceApplicationSubmitRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
