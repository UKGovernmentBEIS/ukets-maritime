import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerInPersonSiteVisit, AerSiteVisit, AerVirtualSiteVisit } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerSiteVisitType, AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class OpinionStatementSiteVisitTypePayloadMutator extends PayloadMutator {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly step = OpinionStatementStep.SITE_VISIT_TYPE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { siteVisitType: AerSiteVisitType },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport?.opinionStatement?.siteVisit) {
          payload.verificationReport.opinionStatement.siteVisit = {} as AerSiteVisit;
        }
        payload.verificationReport.opinionStatement.siteVisit.type = userInput.siteVisitType;

        if (userInput.siteVisitType === 'IN_PERSON') {
          delete (payload.verificationReport.opinionStatement.siteVisit as AerVirtualSiteVisit).reason;
        } else if (userInput.siteVisitType === 'VIRTUAL') {
          delete (payload.verificationReport.opinionStatement.siteVisit as AerInPersonSiteVisit).visitDates;
          delete (payload.verificationReport.opinionStatement.siteVisit as AerInPersonSiteVisit).teamMembers;
        }
      }),
    );
  }
}
