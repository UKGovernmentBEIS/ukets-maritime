import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesPriorYearIssueFormEditPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_EDIT;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string; reference: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput.reference) {
          payload.verificationReport.uncorrectedNonConformities.priorYearIssues =
            payload.verificationReport.uncorrectedNonConformities.priorYearIssues.map((item) =>
              item.reference === userInput.reference ? { ...item, explanation: userInput.explanation } : item,
            );
        }
      }),
    );
  }
}
