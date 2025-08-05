import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { UncorrectedItem } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonCompliancesItemFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;
  readonly step = UncorrectedNonCompliancesStep.ITEM_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: UncorrectedItem,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reference) {
          payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances =
            payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances.map((item) =>
              item.reference === userInput.reference ? userInput : item,
            );
        }
      }),
    );
  }
}
