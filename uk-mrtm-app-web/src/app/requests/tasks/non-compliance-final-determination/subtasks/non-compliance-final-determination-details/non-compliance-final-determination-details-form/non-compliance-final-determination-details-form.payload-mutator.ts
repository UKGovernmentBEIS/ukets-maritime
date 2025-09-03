import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { NonComplianceFinalDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NonComplianceFinalDeterminationDetailsStep,
  NonComplianceFinalDeterminationTaskPayload,
} from '@requests/common/non-compliance';

export class NonComplianceFinalDeterminationDetailsFormPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK;
  readonly step = NonComplianceFinalDeterminationDetailsStep.DETAILS_FORM;

  apply(
    currentPayload: NonComplianceFinalDeterminationTaskPayload,
    userInput: NonComplianceFinalDetermination,
  ): Observable<NonComplianceFinalDeterminationTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.complianceRestored = userInput.complianceRestored;
        payload.complianceRestoredDate = userInput.complianceRestoredDate;
        payload.comments = userInput.comments;
        payload.reissuePenalty = userInput.reissuePenalty;
        payload.operatorPaid = userInput.operatorPaid;
        payload.operatorPaidDate = userInput.operatorPaidDate;
      }),
    );
  }
}
