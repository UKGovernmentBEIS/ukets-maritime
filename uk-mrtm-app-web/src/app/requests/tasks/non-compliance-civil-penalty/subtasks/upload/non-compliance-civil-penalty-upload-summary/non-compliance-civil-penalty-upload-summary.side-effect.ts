import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceCivilPenaltyRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK } from '@requests/common/non-compliance';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class NonComplianceCivilPenaltyUploadSummarySideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: NonComplianceCivilPenaltyRequestTaskPayload,
  ): Observable<NonComplianceCivilPenaltyRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
