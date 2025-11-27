import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class VariationDetailsSummarySideEffect extends SideEffect {
  subtask = VARIATION_DETAILS_SUB_TASK;
  step = undefined;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: EmpVariationTaskPayload): Observable<EmpVariationTaskPayload> {
    return of(
      produce(currentPayload, (payload: EmpVariationTaskPayload) => {
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
        payload.empVariationDetailsCompleted = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
