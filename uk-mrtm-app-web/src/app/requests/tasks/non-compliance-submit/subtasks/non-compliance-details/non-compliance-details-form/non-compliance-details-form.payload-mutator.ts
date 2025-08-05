import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';

export class NonComplianceDetailsFormPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;
  readonly step = NonComplianceDetailsStep.DETAILS_FORM;

  apply(
    currentPayload: NonComplianceSubmitTaskPayload,
    userInput: Pick<NonComplianceSubmitTaskPayload, 'reason' | 'nonComplianceDate' | 'complianceDate' | 'comments'>,
  ): Observable<NonComplianceSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reason = userInput.reason;
        payload.nonComplianceDate = userInput.nonComplianceDate;
        payload.complianceDate = userInput.complianceDate;
        payload.comments = userInput.comments;
      }),
    );
  }
}
