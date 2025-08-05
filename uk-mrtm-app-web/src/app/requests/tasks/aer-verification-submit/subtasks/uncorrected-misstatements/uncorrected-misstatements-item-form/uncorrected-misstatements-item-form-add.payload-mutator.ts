import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_MISSTATEMENTS_SUB_TASK, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedMisstatementsItemFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;
  readonly step = UncorrectedMisstatementsStep.ITEM_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string; materialEffect: boolean },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements) {
          payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements = [];
        }

        const reference = `A${payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements.length + 1}`;
        payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements = [
          ...payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements,
          { ...userInput, reference },
        ];
      }),
    );
  }
}
