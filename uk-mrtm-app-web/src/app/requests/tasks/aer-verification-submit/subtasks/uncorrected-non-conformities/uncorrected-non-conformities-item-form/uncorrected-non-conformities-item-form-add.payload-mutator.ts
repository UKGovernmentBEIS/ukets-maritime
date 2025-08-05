import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesItemFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.ITEM_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string; materialEffect: boolean },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities) {
          payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities = [];
        }

        const reference = `B${payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities.length + 1}`;
        payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities = [
          ...payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities,
          { ...userInput, reference },
        ];
      }),
    );
  }
}
