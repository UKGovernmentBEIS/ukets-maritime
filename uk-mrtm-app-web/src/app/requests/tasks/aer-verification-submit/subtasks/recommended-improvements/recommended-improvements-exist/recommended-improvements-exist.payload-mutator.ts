import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerRecommendedImprovements, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { RECOMMENDED_IMPROVEMENTS_SUB_TASK, RecommendedImprovementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class RecommendedImprovementsExistPayloadMutator extends PayloadMutator {
  readonly subtask = RECOMMENDED_IMPROVEMENTS_SUB_TASK;
  readonly step = RecommendedImprovementsStep.EXIST_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerRecommendedImprovements, 'exist'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (!payload.verificationReport.recommendedImprovements) {
          payload.verificationReport.recommendedImprovements = {} as AerRecommendedImprovements;
        }
        if (payload.verificationReport.recommendedImprovements.exist !== userInput.exist) {
          payload.verificationReport.recommendedImprovements = userInput;
        }
      }),
    );
  }
}
