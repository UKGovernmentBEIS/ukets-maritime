import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonCompliancesItemDeletePayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_COMPLIANCES_SUB_TASK;
  readonly step = UncorrectedNonCompliancesStep.ITEM_DELETE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const items = payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances
          .filter(({ reference }) => reference !== userInput.reference)
          .map((item, index) => ({ ...item, reference: `C${index + 1}` }));

        payload.verificationReport.uncorrectedNonCompliances.uncorrectedNonCompliances = items;
      }),
    );
  }
}
