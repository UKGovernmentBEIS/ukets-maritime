import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerDataGapsMethodologies, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { DATA_GAPS_METHODOLOGIES_SUB_TASK, DataGapsMethodologiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class DataGapsMethodologiesMisstatementPayloadMutator extends PayloadMutator {
  readonly subtask = DATA_GAPS_METHODOLOGIES_SUB_TASK;
  readonly step = DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerDataGapsMethodologies, 'materialMisstatementExist' | 'materialMisstatementDetails'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }

        payload.verificationReport.dataGapsMethodologies.materialMisstatementExist =
          userInput.materialMisstatementExist;
        payload.verificationReport.dataGapsMethodologies.materialMisstatementDetails =
          !userInput.materialMisstatementExist ? null : userInput.materialMisstatementDetails;
      }),
    );
  }
}
