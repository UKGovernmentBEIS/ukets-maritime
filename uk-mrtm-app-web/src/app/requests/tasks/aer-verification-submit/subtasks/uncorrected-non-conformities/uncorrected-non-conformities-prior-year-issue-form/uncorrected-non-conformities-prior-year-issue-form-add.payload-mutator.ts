import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesPriorYearIssueFormAddPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_ADD;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: { explanation: string },
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport.uncorrectedNonConformities.priorYearIssues) {
          payload.verificationReport.uncorrectedNonConformities.priorYearIssues = [];
        }

        const reference = `E${payload.verificationReport.uncorrectedNonConformities.priorYearIssues.length + 1}`;
        payload.verificationReport.uncorrectedNonConformities.priorYearIssues = [
          ...payload.verificationReport.uncorrectedNonConformities.priorYearIssues,
          { ...userInput, reference },
        ];
      }),
    );
  }
}
