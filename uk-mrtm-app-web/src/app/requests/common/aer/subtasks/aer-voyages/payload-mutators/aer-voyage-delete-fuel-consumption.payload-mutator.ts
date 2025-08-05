import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerFuelConsumption, AerVoyage } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageDeleteFuelConsumptionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  public readonly step: string = AerVoyagesWizardStep.DELETE_FUEL_CONSUMPTION;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerFuelConsumption, 'uniqueIdentifier'> & { objectId: AerVoyage['uniqueIdentifier'] },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { objectId, uniqueIdentifier } = userInput;

        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.map((voyage) =>
          voyage.uniqueIdentifier === objectId
            ? {
                ...voyage,
                fuelConsumptions: (voyage.fuelConsumptions ?? []).filter(
                  (fuelConsumption) => fuelConsumption.uniqueIdentifier !== uniqueIdentifier,
                ),
              }
            : voyage,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${objectId}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
