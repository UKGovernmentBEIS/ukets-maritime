import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVerifiedSatisfactoryWithCommentsDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OverallVerificationDecisionCommentsDeletePayloadMutator extends PayloadMutator {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly step = OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_DELETE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reasonIndex: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const reasonIndex = +userInput.reasonIndex;
        const reasons = [
          ...(payload.verificationReport.overallDecision as AerVerifiedSatisfactoryWithCommentsDecision).reasons,
        ];

        if (reasons[reasonIndex]) {
          reasons.splice(reasonIndex, 1);
        }

        (payload.verificationReport.overallDecision as AerVerifiedSatisfactoryWithCommentsDecision).reasons = reasons;
      }),
    );
  }
}
