import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonCompliancesItemFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;
  readonly step = UncorrectedNonCompliancesStep.ITEM_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string; materialEffect: boolean },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances) {
          payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances = [];
        }

        const reference = `C${payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances.length + 1}`;
        payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances = [
          ...payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances,
          { ...userInput, reference },
        ];
      }),
    );
  }
}
