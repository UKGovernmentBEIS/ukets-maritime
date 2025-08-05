import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { EmpVariationReviewTaskPayload, TaskItemStatus } from '@requests/common';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';

export class VariationDetailsDecisionSideEffect extends SideEffect {
  step = null;
  subtask = VARIATION_DETAILS_SUB_TASK;
  on = ['SAVE_SUBTASK'];

  apply(currentPayload: EmpVariationReviewTaskPayload): Observable<EmpVariationReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empVariationDetailsReviewCompleted = TaskItemStatus.IN_PROGRESS;
        payload.empVariationDetailsCompleted = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
