import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerUncorrectedNonConformities, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesExistPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.EXIST_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerUncorrectedNonConformities, 'exist'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.uncorrectedNonConformities) {
          payload.verificationReport.uncorrectedNonConformities = {} as AerUncorrectedNonConformities;
        }

        if (payload.verificationReport.uncorrectedNonConformities.exist !== userInput.exist) {
          payload.verificationReport.uncorrectedNonConformities = {
            ...payload.verificationReport.uncorrectedNonConformities,
            exist: userInput.exist,
            uncorrectedNonConformities: userInput.exist ? [] : undefined,
          };
        }
      }),
    );
  }
}
