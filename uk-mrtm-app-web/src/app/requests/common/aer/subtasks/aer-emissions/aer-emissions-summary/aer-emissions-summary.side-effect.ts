import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerEmissionsSummarySideEffect extends SideEffect {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = undefined;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerSubmitTaskPayload): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
        if (payload.aerSectionsCompleted[AER_REDUCTION_CLAIM_SUB_TASK] === TaskItemStatus.COMPLETED) {
          payload.aerSectionsCompleted[AER_REDUCTION_CLAIM_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
        }
        if (payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] === TaskItemStatus.COMPLETED) {
          payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
        }
      }),
    );
  }
}
