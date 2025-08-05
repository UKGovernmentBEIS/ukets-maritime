import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerDataGapsMethodologies, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { DATA_GAPS_METHODOLOGIES_SUB_TASK, DataGapsMethodologiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class DataGapsMethodologiesApprovedPayloadMutator extends PayloadMutator {
  readonly subtask = DATA_GAPS_METHODOLOGIES_SUB_TASK;
  readonly step = DataGapsMethodologiesStep.METHOD_APPROVED;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerDataGapsMethodologies, 'methodApproved'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (payload.verificationReport.dataGapsMethodologies?.methodApproved !== userInput.methodApproved) {
          payload.verificationReport.dataGapsMethodologies = {
            methodRequired: payload.verificationReport.dataGapsMethodologies.methodRequired,
            methodApproved: userInput.methodApproved,
          };
        }
      }),
    );
  }
}
