import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK } from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';

export class EmissionsReductionClaimsVerificationInProgressSideEffect extends SideEffect {
  readonly step = null;
  readonly subtask = EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK;
  readonly on: SubtaskOperation[] = ['SAVE_SUBTASK'];

  override apply(currentPayload: AerVerificationSubmitTaskPayload): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.verificationSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
