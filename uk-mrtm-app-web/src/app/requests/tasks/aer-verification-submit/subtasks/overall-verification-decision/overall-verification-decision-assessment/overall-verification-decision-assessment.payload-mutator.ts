import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVerificationDecision, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OverallVerificationDecisionAssessmentPayloadMutator extends PayloadMutator {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly step = OverallVerificationDecisionStep.ASSESSMENT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerVerificationDecision, 'type'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.overallDecision) {
          payload.verificationReport.overallDecision = {} as AerVerificationDecision;
        }
        if (payload.verificationReport.overallDecision.type !== userInput.type) {
          payload.verificationReport.overallDecision = { type: userInput.type };
        }
      }),
    );
  }
}
