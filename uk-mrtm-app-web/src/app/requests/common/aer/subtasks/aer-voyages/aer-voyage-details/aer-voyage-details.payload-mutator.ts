import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerVoyageDetailsFormModel } from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-details/aer-voyage-details.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { mergeDatesToString } from '@shared/utils';

export class AerVoyageDetailsPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_VOYAGES_SUB_TASK;
  public readonly step = AerVoyagesWizardStep.VOYAGE_DETAILS;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerVoyageDetailsFormModel,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...voyageDetails } = userInput;

        payload.aer.voyageEmissions.voyages = (payload.aer?.voyageEmissions?.voyages ?? []).map((voyageItem) =>
          voyageItem.uniqueIdentifier === uniqueIdentifier
            ? {
                ...voyageItem,
                voyageDetails: {
                  arrivalTime: mergeDatesToString(voyageDetails.arrivalDate, voyageDetails.arrivalTime),
                  departureTime: mergeDatesToString(voyageDetails.departureDate, voyageDetails.departureTime),
                  departurePort: {
                    country: voyageDetails.departureCountry,
                    port: voyageDetails.departurePort,
                  },
                  arrivalPort: {
                    country: voyageDetails.arrivalCountry,
                    port: voyageDetails.arrivalPort,
                  },
                  ccs: voyageDetails.ccs,
                  ccu: voyageDetails.ccu,
                  smallIslandFerryReduction: voyageDetails.smallIslandFerryReduction,
                },
              }
            : voyageItem,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
