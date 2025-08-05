import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';

export class NonComplianceDetailsNoticeOfIntentPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;
  readonly step = NonComplianceDetailsStep.NOTICE_OF_INTENT;

  apply(
    currentPayload: NonComplianceSubmitTaskPayload,
    userInput: Pick<NonComplianceSubmitTaskPayload, 'noticeOfIntent'>,
  ): Observable<NonComplianceSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.noticeOfIntent = userInput.noticeOfIntent;
      }),
    );
  }
}
