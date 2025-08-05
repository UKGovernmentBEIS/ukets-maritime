import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { UncorrectedItem } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_MISSTATEMENTS_SUB_TASK, UncorrectedMisstatementsStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedMisstatementsItemFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_MISSTATEMENTS_SUB_TASK;
  readonly step = UncorrectedMisstatementsStep.ITEM_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: UncorrectedItem,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reference) {
          payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements =
            payload.verificationReport.uncorrectedMisstatements.uncorrectedMisstatements.map((item) =>
              item.reference === userInput.reference ? userInput : item,
            );
        }
      }),
    );
  }
}
