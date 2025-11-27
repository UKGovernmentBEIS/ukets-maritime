import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerEmissionsReductionClaimVerification, AerVerificationReport } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
  EmissionsReductionClaimsVerificationStep,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';

export class EmissionsReductionClaimVerificationFormPayload extends PayloadMutator {
  readonly subtask = EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK;
  readonly step = EmissionsReductionClaimsVerificationStep.FORM;

  apply(
    currentPayload: AerVerificationSubmitTaskPayload,
    userInput: AerEmissionsReductionClaimVerification,
  ): Observable<AerVerificationSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerVerificationSubmitTaskPayload) => {
        if (!payload.verificationReport) {
          payload.verificationReport = {} as AerVerificationReport;
        }

        payload.verificationReport.emissionsReductionClaimVerification = userInput;
      }),
    );
  }
}
