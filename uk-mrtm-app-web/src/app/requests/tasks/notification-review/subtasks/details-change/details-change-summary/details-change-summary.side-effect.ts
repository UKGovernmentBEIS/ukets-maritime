import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-review/subtasks/details-change';

export class DetailsChangeSummarySideEffect extends SideEffect {
  step = undefined;
  subtask = DETAILS_CHANGE_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: ReviewTaskPayload): Observable<ReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = [TaskItemStatus.ACCEPTED, TaskItemStatus.REJECTED].includes(
          payload?.reviewDecision?.type as TaskItemStatus,
        )
          ? payload?.reviewDecision?.type
          : TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
