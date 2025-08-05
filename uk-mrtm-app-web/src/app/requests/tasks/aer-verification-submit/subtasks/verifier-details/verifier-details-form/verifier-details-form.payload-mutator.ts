import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVerificationReport, AerVerificationTeamDetails, AerVerifierContact } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { VERIFIER_DETAILS_SUB_TASK, VerifierDetailsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class VerifierDetailsFormPayloadMutator extends PayloadMutator {
  readonly subtask = VERIFIER_DETAILS_SUB_TASK;
  readonly step = VerifierDetailsStep.FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: AerVerifierContact & AerVerificationTeamDetails,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.verifierContact) {
          payload.verificationReport.verifierContact = {} as AerVerifierContact;
        }
        if (!payload.verificationReport.verificationTeamDetails) {
          payload.verificationReport.verificationTeamDetails = {} as AerVerificationTeamDetails;
        }

        payload.verificationReport.verifierContact = {
          name: userInput.name,
          email: userInput.email,
          phoneNumber: userInput.phoneNumber,
        };
        payload.verificationReport.verificationTeamDetails = {
          leadEtsAuditor: userInput.leadEtsAuditor,
          etsAuditors: userInput.etsAuditors,
          etsTechnicalExperts: userInput.etsTechnicalExperts,
          independentReviewer: userInput.independentReviewer,
          technicalExperts: userInput.technicalExperts,
          authorisedSignatoryName: userInput.authorisedSignatoryName,
        };
      }),
    );
  }
}
