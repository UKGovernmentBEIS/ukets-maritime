import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVoyage } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
  getAerJourneyType,
  isVoyageWizardCompleted,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageUploadPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_VOYAGES_SUB_TASK;
  public readonly step = AerVoyagesWizardStep.UPLOAD_VOYAGES;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerVoyage[]): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const existingVoyages = payload.aer.voyageEmissions?.voyages || [];
        const userInputMap = new Map<string, AerVoyage>();
        userInput.forEach((voyage) => {
          userInputMap.set(voyage.uniqueIdentifier, voyage);
        });
        const filteredExistingVoyages = existingVoyages.filter((voyage) => !userInputMap.has(voyage.uniqueIdentifier));
        const mergedVoyages = [...filteredExistingVoyages, ...userInput];

        payload.aer.voyageEmissions.voyages = mergedVoyages;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;

        const ships = payload.aer?.emissions?.ships ?? [];
        mergedVoyages.forEach((voyage) => {
          const voyageItem = {
            ...voyage,
            relatedShip: ships?.find((ship) => ship?.details?.imoNumber === voyage?.imoNumber),
            journeyType: getAerJourneyType(voyage?.voyageDetails),
          };

          payload.aerSectionsCompleted[`${this.subtask}-voyage-${voyage.uniqueIdentifier}`] = isVoyageWizardCompleted(
            voyageItem,
            true,
          )
            ? TaskItemStatus.COMPLETED
            : TaskItemStatus.IN_PROGRESS;
        });
      }),
    );
  }
}
