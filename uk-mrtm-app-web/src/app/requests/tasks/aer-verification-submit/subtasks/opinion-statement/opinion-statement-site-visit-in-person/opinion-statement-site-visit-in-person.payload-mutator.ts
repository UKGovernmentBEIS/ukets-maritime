import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerInPersonSiteVisit } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { OPINION_STATEMENT_SUB_TASK, OpinionStatementStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerInPersonSiteVisitFormModel } from '@requests/tasks/aer-verification-submit/subtasks/opinion-statement/opinion-statement-site-visit-in-person/opinion-statement-site-visit-in-person.types';

export class OpinionStatementSiteVisitInPersonPayloadMutator extends PayloadMutator {
  readonly subtask = OPINION_STATEMENT_SUB_TASK;
  readonly step = OpinionStatementStep.SITE_VISIT_IN_PERSON;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: AerInPersonSiteVisitFormModel,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const siteVisit = payload.verificationReport.opinionStatement.siteVisit as AerInPersonSiteVisit;
        siteVisit.visitDates = userInput.visitDates.map((visitDate) => ({
          startDate: visitDate.startDate.toISOString(),
          numberOfDays: visitDate.numberOfDays,
        }));
        siteVisit.teamMembers = userInput.teamMembers;
      }),
    );
  }
}
