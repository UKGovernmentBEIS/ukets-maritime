import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationFollowUpSaveResponseRequestTaskActionPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FOLLOW_UP_RESPONSE_SUB_TASK } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';

export class FollowUpResponseSummarySideEffect extends SideEffect {
  step = null;
  subtask = FOLLOW_UP_RESPONSE_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpNotificationFollowUpSaveResponseRequestTaskActionPayload,
  ): Observable<EmpNotificationFollowUpSaveResponseRequestTaskActionPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
