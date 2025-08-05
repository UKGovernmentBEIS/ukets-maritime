import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationApplicationSaveRequestTaskActionPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-submit/subtasks/details-change';

export class SummarySideEffect extends SideEffect {
  step = undefined;
  subtask = DETAILS_CHANGE_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpNotificationApplicationSaveRequestTaskActionPayload,
  ): Observable<EmpNotificationApplicationSaveRequestTaskActionPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
