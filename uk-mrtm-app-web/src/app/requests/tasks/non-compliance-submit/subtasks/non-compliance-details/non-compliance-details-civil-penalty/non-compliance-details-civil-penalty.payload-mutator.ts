import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';

export class NonComplianceDetailsCivilPenaltyPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;
  readonly step = NonComplianceDetailsStep.CIVIL_PENALTY;

  apply(
    currentPayload: NonComplianceSubmitTaskPayload,
    userInput: Pick<NonComplianceSubmitTaskPayload, 'civilPenalty' | 'noCivilPenaltyJustification'>,
  ): Observable<NonComplianceSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (payload.civilPenalty !== userInput.civilPenalty) {
          payload.initialPenalty = undefined;
          payload.noticeOfIntent = undefined;
        }
        payload.civilPenalty = userInput.civilPenalty;
        payload.noCivilPenaltyJustification = userInput.noCivilPenaltyJustification;
      }),
    );
  }
}
