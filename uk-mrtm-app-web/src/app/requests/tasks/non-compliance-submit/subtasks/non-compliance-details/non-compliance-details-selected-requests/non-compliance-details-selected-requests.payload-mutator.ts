import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';
import { isNil } from '@shared/utils';

export class NonComplianceDetailsSelectedRequestsPayloadMutator extends PayloadMutator {
  readonly subtask = NON_COMPLIANCE_DETAILS_SUB_TASK;
  readonly step = NonComplianceDetailsStep.SELECTED_REQUESTS;

  apply(
    currentPayload: NonComplianceSubmitTaskPayload,
    userInput: Pick<NonComplianceSubmitTaskPayload, 'selectedRequests'>,
  ): Observable<NonComplianceSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.selectedRequests = userInput.selectedRequests.filter((id) => !isNil(id));
      }),
    );
  }
}
