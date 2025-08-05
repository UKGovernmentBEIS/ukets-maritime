import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';

export class AmendsDetailsSideEffect extends SideEffect {
  step = null;
  subtask = AMENDS_DETAILS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload,
  ): Observable<EmpNotificationFollowUpSaveApplicationAmendRequestTaskActionPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
