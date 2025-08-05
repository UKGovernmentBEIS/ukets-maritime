import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';

export class NonComplianceDetailsInitialPenaltyPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;
  readonly step = NonComplianceDetailsStep.INITIAL_PENALTY;

  apply(
    currentPayload: NonComplianceSubmitTaskPayload,
    userInput: Pick<NonComplianceSubmitTaskPayload, 'initialPenalty'>,
  ): Observable<NonComplianceSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.initialPenalty = userInput.initialPenalty;
      }),
    );
  }
}
