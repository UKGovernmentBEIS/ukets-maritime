import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerNotVerifiedDecision, AerNotVerifiedDecisionReason } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OVERALL_VERIFICATION_DECISION_SUB_TASK, OverallVerificationDecisionStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OverallVerificationDecisionNotVerifiedReasonsPayloadMutator extends PayloadMutator {
  readonly subtask = OVERALL_VERIFICATION_DECISION_SUB_TASK;
  readonly step = OverallVerificationDecisionStep.NOT_VERIFIED_REASONS;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: {
      reasons: AerNotVerifiedDecisionReason['type'][];
      detailsAnotherReason: string;
      detailsVerificationDataLimitations: string;
      detailsScopeLimitationsClarity: string;
      detailsScopeLimitationsEmp: string;
      detailsEmpNotApproved: string;
    },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        (payload.verificationReport.overallDecision as AerNotVerifiedDecision).notVerifiedReasons =
          userInput.reasons.map((type) => {
            let details;

            switch (type) {
              case 'VERIFICATION_DATA_OR_INFORMATION_LIMITATIONS':
                details = userInput.detailsVerificationDataLimitations;
                break;
              case 'SCOPE_LIMITATIONS_DUE_TO_LACK_OF_CLARITY':
                details = userInput.detailsScopeLimitationsClarity;
                break;
              case 'SCOPE_LIMITATIONS_OF_APPROVED_MONITORING_PLAN':
                details = userInput.detailsScopeLimitationsEmp;
                break;
              case 'NOT_APPROVED_MONITORING_PLAN_BY_REGULATOR':
                details = userInput.detailsEmpNotApproved;
                break;
              case 'ANOTHER_REASON':
                details = userInput.detailsAnotherReason;
                break;
            }

            return { type, details };
          });
      }),
    );
  }
}
