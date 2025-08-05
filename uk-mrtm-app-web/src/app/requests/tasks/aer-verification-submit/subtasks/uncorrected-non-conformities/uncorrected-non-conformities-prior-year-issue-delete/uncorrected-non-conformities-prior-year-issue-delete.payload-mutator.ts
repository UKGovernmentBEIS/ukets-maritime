import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesPriorYearIssueDeletePayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_DELETE;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        const items = payload.verificationReport.uncorrectedNonConformities.priorYearIssues
          .filter(({ reference }) => reference !== userInput.reference)
          .map((item, index) => ({ ...item, reference: `E${index + 1}` }));

        payload.verificationReport.uncorrectedNonConformities.priorYearIssues = items;
      }),
    );
  }
}
