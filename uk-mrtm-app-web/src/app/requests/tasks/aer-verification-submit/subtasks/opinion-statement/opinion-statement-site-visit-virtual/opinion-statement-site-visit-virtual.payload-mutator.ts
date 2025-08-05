import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVirtualSiteVisit } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OpinionStatementSiteVisitVirtualPayloadMutator extends PayloadMutator {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly step = OpinionStatementStep.SITE_VISIT_VIRTUAL;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reason: AerVirtualSiteVisit['reason'] },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        (payload.verificationReport.opinionStatement.siteVisit as AerVirtualSiteVisit).reason = userInput.reason;
      }),
    );
  }
}
