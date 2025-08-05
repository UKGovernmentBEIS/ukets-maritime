import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerOpinionStatement } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OpinionStatementAdditionalChangesPayloadMutator extends PayloadMutator {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly step = OpinionStatementStep.ADDITIONAL_CHANGES;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerOpinionStatement, 'additionalChangesNotCovered' | 'additionalChangesNotCoveredDetails'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.verificationReport.opinionStatement = { ...payload.verificationReport.opinionStatement, ...userInput };

        if (userInput.additionalChangesNotCovered === false) {
          delete payload.verificationReport.opinionStatement.additionalChangesNotCoveredDetails;
        }
      }),
    );
  }
}
