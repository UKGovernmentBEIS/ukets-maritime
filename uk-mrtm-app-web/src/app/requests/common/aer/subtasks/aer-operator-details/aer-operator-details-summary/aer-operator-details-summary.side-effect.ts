import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerOperatorDetailsSummarySideEffect extends SideEffect {
  step = null;
  readonly subtask = OPERATOR_DETAILS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
