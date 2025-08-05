import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';

export class VariationDetailsSideEffect extends SideEffect {
  step = null;
  subtask = VARIATION_DETAILS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  apply(currentPayload: EmpVariationReviewTaskPayload): Observable<EmpVariationReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empVariationDetailsReviewCompleted = currentPayload.empVariationDetailsReviewDecision.type;
        payload.empVariationDetailsCompleted = TaskItemStatus.COMPLETED;
        delete payload.empSectionsCompleted[VARIATION_DETAILS_SUB_TASK];

        if (currentPayload?.determination?.type === TaskItemStatus.APPROVED) {
          delete payload.determination;
          delete payload.empVariationDetailsCompleted;
        }
      }),
    );
  }
}
