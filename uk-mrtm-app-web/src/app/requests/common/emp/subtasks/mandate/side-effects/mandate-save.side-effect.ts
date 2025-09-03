import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class MandateSaveSideEffect extends SideEffect {
  public subtask: string = MANDATE_SUB_TASK;
  public step: string | undefined = undefined;
  public on = ['SAVE_SUBTASK'];

  public apply(currentPayload: EmpTaskPayload): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
