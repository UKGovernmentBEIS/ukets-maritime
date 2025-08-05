import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVerifiedSatisfactoryWithCommentsDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OverallVerificationDecisionCommentsFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly step = OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reason: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const overallDecision = payload.verificationReport
          .overallDecision as AerVerifiedSatisfactoryWithCommentsDecision;
        overallDecision.reasons = [...(overallDecision.reasons ?? []), userInput.reason];
      }),
    );
  }
}
