import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import { MARITIME_EMISSIONS_SUB_TASK } from '@requests/tasks/doe-submit/subtasks/maritime-emissions';

export class MaritimeEmissionsSummarySideEffect extends SideEffect {
  step = undefined;
  subtask = MARITIME_EMISSIONS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: DoeTaskPayload): Observable<DoeTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
