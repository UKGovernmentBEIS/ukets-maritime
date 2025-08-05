import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerDataGapsMethodologies, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { DATA_GAPS_METHODOLOGIES_SUB_TASK, DataGapsMethodologiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class DataGapsMethodologiesRequiredPayloadMutator extends PayloadMutator {
  readonly subtask = DATA_GAPS_METHODOLOGIES_SUB_TASK;
  readonly step = DataGapsMethodologiesStep.METHOD_REQUIRED;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerDataGapsMethodologies, 'methodRequired'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (payload.verificationReport.dataGapsMethodologies?.methodRequired !== userInput.methodRequired) {
          payload.verificationReport.dataGapsMethodologies = userInput;
        }
      }),
    );
  }
}
