import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerUncorrectedNonCompliances, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonCompliancesExistPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;
  readonly step = UncorrectedNonCompliancesStep.EXIST_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerUncorrectedNonCompliances, 'exist'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.uncorrectedNonCompliances) {
          payload.verificationReport.uncorrectedNonCompliances = {} as AerUncorrectedNonCompliances;
        }

        if (payload.verificationReport.uncorrectedNonCompliances.exist !== userInput.exist) {
          payload.verificationReport.uncorrectedNonCompliances = {
            ...payload.verificationReport.uncorrectedNonCompliances,
            exist: userInput.exist,
            uncorrectedNonCompliances: userInput.exist ? [] : undefined,
          };
        }
      }),
    );
  }
}
