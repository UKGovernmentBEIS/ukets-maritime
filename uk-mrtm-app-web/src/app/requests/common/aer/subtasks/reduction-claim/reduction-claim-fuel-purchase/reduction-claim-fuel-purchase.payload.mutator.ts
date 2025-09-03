import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { AerSmfPurchase } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { ReductionClaimFuelPurchaseFormModel } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-fuel-purchase/reduction-claim-fuel-purchase.types';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class ReductionClaimFuelPurchasePayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_REDUCTION_CLAIM_SUB_TASK;
  public readonly step: string = ReductionClaimWizardStep.FUEL_PURCHASE;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Omit<ReductionClaimFuelPurchaseFormModel, 'evidenceFiles'> & { evidenceFiles: Array<UploadedFile> },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const relatedFuelOrigin = this.store
          .select(aerCommonQuery.selectSupersetOfFuelTypes)()
          .find((fuel) => fuel.uniqueIdentifier === userInput.fuelOriginTypeName);

        const editedPurchase = payload.aer.smf?.smfDetails?.purchases?.find(
          (x) => x.uniqueIdentifier === userInput.uniqueIdentifier,
        );

        const currentFuelPurchase: AerSmfPurchase = {
          ...userInput,
          fuelOriginTypeName: {
            origin: relatedFuelOrigin.origin,
            name: relatedFuelOrigin.name,
            type: (relatedFuelOrigin as any).type,
            uniqueIdentifier: relatedFuelOrigin.uniqueIdentifier,
          } as any,
          evidenceFiles: createFileUploadPayload(userInput?.evidenceFiles ?? []),
        };

        if (!isNil(editedPurchase)) {
          payload.aer.smf.smfDetails = {
            ...payload.aer.smf.smfDetails,
            purchases: payload.aer.smf.smfDetails.purchases.map((purchase: AerSmfPurchase) =>
              purchase.uniqueIdentifier !== userInput.uniqueIdentifier ? purchase : currentFuelPurchase,
            ),
          };
        } else {
          payload.aer.smf.smfDetails = {
            ...payload.aer.smf.smfDetails,
            purchases: [...(payload.aer.smf?.smfDetails?.purchases ?? []), currentFuelPurchase],
          };
        }

        payload.aerAttachments = {
          ...payload.aerAttachments,
          ...transformToTaskAttachments(userInput.evidenceFiles),
        };
      }),
    );
  }
}
