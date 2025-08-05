import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerUncorrectedMisstatements, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_MISSTATEMENTS_SUB_TASK, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedMisstatementsExistPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;
  readonly step = UncorrectedMisstatementsStep.EXIST_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerUncorrectedMisstatements, 'exist'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.uncorrectedMisstatements) {
          payload.verificationReport.uncorrectedMisstatements = {} as AerUncorrectedMisstatements;
        }

        if (payload.verificationReport.uncorrectedMisstatements.exist !== userInput.exist) {
          payload.verificationReport.uncorrectedMisstatements = {
            ...payload.verificationReport.uncorrectedMisstatements,
            exist: userInput.exist,
            uncorrectedMisstatements: userInput.exist ? [] : undefined,
          };
        }
      }),
    );
  }
}
