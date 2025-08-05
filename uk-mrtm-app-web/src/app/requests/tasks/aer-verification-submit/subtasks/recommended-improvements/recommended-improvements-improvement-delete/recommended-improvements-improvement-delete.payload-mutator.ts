import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { RECOMMENDED_IMPROVEMENTS_SUB_TASK, RecommendedImprovementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class RecommendedImprovementsImprovementDeletePayloadMutator extends PayloadMutator {
  readonly subtask = RECOMMENDED_IMPROVEMENTS_SUB_TASK;
  readonly step = RecommendedImprovementsStep.ITEM_DELETE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const improvements = payload.verificationReport.recommendedImprovements.recommendedImprovements
          .filter(({ reference }) => reference !== userInput.reference)
          .map(({ explanation }, index) => ({ explanation, reference: `D${index + 1}` }));

        payload.verificationReport.recommendedImprovements.recommendedImprovements = improvements;
      }),
    );
  }
}
