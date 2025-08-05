import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerEtsComplianceRules, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ETS_COMPLIANCE_RULES_SUB_TASK, EtsComplianceRulesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class EtsComplianceRulesFormPayloadMutator extends PayloadMutator {
  readonly subtask = ETS_COMPLIANCE_RULES_SUB_TASK;
  readonly step = EtsComplianceRulesStep.FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: AerEtsComplianceRules,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        payload.verificationReport.etsComplianceRules = userInput;
      }),
    );
  }
}
