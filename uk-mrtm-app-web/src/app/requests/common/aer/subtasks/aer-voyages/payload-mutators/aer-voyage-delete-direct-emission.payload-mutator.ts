import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerVoyage } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageDeleteDirectEmissionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  public readonly step: string = AerVoyagesWizardStep.DELETE_DIRECT_EMISSIONS;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerVoyage['uniqueIdentifier'],
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.map((voyage) =>
          voyage.uniqueIdentifier === userInput ? { ...voyage, directEmissions: undefined } : voyage,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${userInput}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
