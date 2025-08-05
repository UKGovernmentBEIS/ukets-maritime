import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';
import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';

export class AmendsDetailsPayloadMutator extends PayloadMutator {
  subtask = AMENDS_DETAILS_SUB_TASK;
  step = 'details';

  /**
   * @param currentPayload
   */
  apply(currentPayload: FollowUpAmendTaskPayload): Observable<FollowUpAmendTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
