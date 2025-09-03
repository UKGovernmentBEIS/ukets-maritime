import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { ReductionClaimDetailsListItemDto } from '@shared/types';

export class ReductionClaimDetailsPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;
  public readonly step: string = ReductionClaimWizardStep.DELETE_FUEL_PURCHASE;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: ReductionClaimDetailsListItemDto,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.smf.smfDetails.purchases = payload.aer.smf.smfDetails.purchases.filter(
          (x) => x?.uniqueIdentifier !== userInput?.uniqueIdentifier,
        );
      }),
    );
  }
}
