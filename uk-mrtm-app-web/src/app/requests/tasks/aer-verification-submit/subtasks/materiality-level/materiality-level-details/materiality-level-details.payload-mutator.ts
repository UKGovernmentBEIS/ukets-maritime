import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerMaterialityLevel, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { MATERIALITY_LEVEL_SUB_TASK, MaterialityLevelStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class MaterialityLevelDetailsPayloadMutator extends PayloadMutator {
  readonly subtask = MATERIALITY_LEVEL_SUB_TASK;
  readonly step = MaterialityLevelStep.DETAILS;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerMaterialityLevel, 'materialityDetails'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.materialityLevel) {
          payload.verificationReport.materialityLevel = {} as AerMaterialityLevel;
        }
        payload.verificationReport.materialityLevel = {
          ...payload.verificationReport.materialityLevel,
          materialityDetails: userInput.materialityDetails,
        };
      }),
    );
  }
}
