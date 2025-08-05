import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { UncorrectedItem } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesItemFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.ITEM_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: UncorrectedItem,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reference) {
          payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities =
            payload.verificationReport.uncorrectedNonConformities.uncorrectedNonConformities.map((item) =>
              item.reference === userInput.reference ? userInput : item,
            );
        }
      }),
    );
  }
}
