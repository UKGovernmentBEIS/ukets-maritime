import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ReductionClaimSummarySideEffect extends SideEffect {
  public readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;
  public readonly step: string | undefined = undefined;
  public readonly on: string[] = ['SUBMIT_SUBTASK'];

  public apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
