import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import { MARITIME_EMISSIONS_SUB_TASK } from '@requests/tasks/doe-submit/subtasks/maritime-emissions';

export class MaritimeEmissionsSummarySideEffect extends SideEffect {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  step = undefined;
  subtask = MARITIME_EMISSIONS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: DoeTaskPayload): Observable<DoeTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
