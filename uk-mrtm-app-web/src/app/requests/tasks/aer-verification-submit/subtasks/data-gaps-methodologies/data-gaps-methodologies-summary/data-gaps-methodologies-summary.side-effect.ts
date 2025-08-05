import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { DATA_GAPS_METHODOLOGIES_SUB_TASK } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class DataGapsMethodologiesSummarySideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = DATA_GAPS_METHODOLOGIES_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerVerificationSubmitTaskPayload): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.verificationSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
