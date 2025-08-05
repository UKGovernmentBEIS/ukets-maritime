import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVerifiedSatisfactoryWithCommentsDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OverallVerificationDecisionCommentsFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly step = OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reason: string; reasonIndex: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reasonIndex) {
          (payload.verificationReport.overallDecision as AerVerifiedSatisfactoryWithCommentsDecision).reasons[
            userInput.reasonIndex
          ] = userInput.reason;
        }
      }),
    );
  }
}
