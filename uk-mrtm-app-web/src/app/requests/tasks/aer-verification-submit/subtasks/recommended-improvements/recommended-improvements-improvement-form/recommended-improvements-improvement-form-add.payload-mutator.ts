import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { RECOMMENDED_IMPROVEMENTS_SUB_TASK, RecommendedImprovementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class RecommendedImprovementsImprovementFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = RECOMMENDED_IMPROVEMENTS_SUB_TASK;
  readonly step = RecommendedImprovementsStep.ITEM_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport.recommendedImprovements.recommendedImprovements) {
          payload.verificationReport.recommendedImprovements.recommendedImprovements = [];
        }

        const reference = `D${payload.verificationReport.recommendedImprovements.recommendedImprovements.length + 1}`;
        payload.verificationReport.recommendedImprovements.recommendedImprovements = [
          ...payload.verificationReport.recommendedImprovements.recommendedImprovements,
          { explanation: userInput.explanation, reference },
        ];
      }),
    );
  }
}
