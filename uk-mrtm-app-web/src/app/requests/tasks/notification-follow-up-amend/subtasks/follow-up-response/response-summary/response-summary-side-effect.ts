import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationFollowUpSaveResponseRequestTaskActionPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FOLLOW_UP_RESPONSE_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';

export class ResponseSummarySideEffect extends SideEffect {
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
