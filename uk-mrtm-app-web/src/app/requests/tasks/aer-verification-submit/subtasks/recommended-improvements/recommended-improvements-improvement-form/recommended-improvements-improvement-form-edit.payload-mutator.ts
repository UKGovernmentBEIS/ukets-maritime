import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { RECOMMENDED_IMPROVEMENTS_SUB_TASK, RecommendedImprovementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class RecommendedImprovementsImprovementFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = RECOMMENDED_IMPROVEMENTS_SUB_TASK;
  readonly step = RecommendedImprovementsStep.ITEM_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string; reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reference) {
          payload.verificationReport.recommendedImprovements.recommendedImprovements =
            payload.verificationReport.recommendedImprovements.recommendedImprovements.map(
              ({ explanation, reference }) =>
                reference === userInput.reference
                  ? { explanation: userInput.explanation, reference }
                  : { explanation, reference },
            );
        }
      }),
    );
  }
}
