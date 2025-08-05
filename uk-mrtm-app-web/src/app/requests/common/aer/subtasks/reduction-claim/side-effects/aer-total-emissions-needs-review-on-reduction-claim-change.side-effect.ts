import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerTotalEmissionsNeedsReviewOnReductionClaimChangeSideEffect extends SideEffect {
  readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;
  readonly step: string = undefined;
  readonly on = ['SAVE_SUBTASK', 'SUBMIT_SUBTASK'];

  apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        if (payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] === TaskItemStatus.COMPLETED) {
          payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
        }
      }),
    );
  }
}
