import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_MISSTATEMENTS_SUB_TASK, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedMisstatementsItemDeletePayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;
  readonly step = UncorrectedMisstatementsStep.ITEM_DELETE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const items = payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements
          .filter(({ reference }) => reference !== userInput.reference)
          .map((item, index) => ({ ...item, reference: `A${index + 1}` }));

        payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements = items;
      }),
    );
  }
}
