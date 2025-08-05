import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK } from '@requests/common/non-compliance';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class NonComplianceNoticeOfIntentUploadInProgressSideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  override apply(
    currentPayload: NonComplianceNoticeOfIntentRequestTaskPayload,
  ): Observable<NonComplianceNoticeOfIntentRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
