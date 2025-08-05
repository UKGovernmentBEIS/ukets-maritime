import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { ETS_COMPLIANCE_RULES_SUB_TASK } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class EtsComplianceRulesInProgressSideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = ETS_COMPLIANCE_RULES_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  override apply(currentPayload: AerVerificationSubmitTaskPayload): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.verificationSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
