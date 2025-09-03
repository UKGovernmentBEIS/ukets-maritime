import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NonComplianceFinalDeterminationTaskPayload,
} from '@requests/common/non-compliance';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class NonComplianceFinalDeterminationDetailsInProgressSideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  override apply(
    currentPayload: NonComplianceFinalDeterminationTaskPayload,
  ): Observable<NonComplianceFinalDeterminationTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
