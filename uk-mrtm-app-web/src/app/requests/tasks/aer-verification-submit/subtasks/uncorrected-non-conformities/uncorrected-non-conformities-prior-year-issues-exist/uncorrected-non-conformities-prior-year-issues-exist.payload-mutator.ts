import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerUncorrectedNonConformities, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';

export class UncorrectedNonConformitiesPriorYearIssuesExistPayloadMutator extends PayloadMutator {
  readonly subtask = UNCORRECTED_NON_CONFORMITIES_SUB_TASK;
  readonly step = UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: Pick<AerUncorrectedNonConformities, 'existPriorYearIssues'>,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }
        if (
          payload.verificationReport.uncorrectedNonConformities.existPriorYearIssues !== userInput.existPriorYearIssues
        ) {
          payload.verificationReport.uncorrectedNonConformities = {
            ...payload.verificationReport.uncorrectedNonConformities,
            existPriorYearIssues: userInput.existPriorYearIssues,
            priorYearIssues: userInput.existPriorYearIssues ? [] : undefined,
          };
        }
      }),
    );
  }
}
