import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { bigNumberUtils } from '@shared/utils';

export class ReductionClaimFuelPurchaseSideEffect extends SideEffect {
  public readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;
  public readonly step: string = ReductionClaimWizardStep.FUEL_PURCHASE;
  public readonly on = ['SAVE_SUBTASK'];

  public apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.smf.smfDetails.totalSustainableEmissions = bigNumberUtils.getSum(
          payload.aer.smf.smfDetails.purchases.map((purchase) => purchase.co2Emissions),
          7,
        );
      }),
    );
  }
}
