import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerPortSummaryItemDto } from '@shared/types';

export class AerVoyageDeletePayloadMutator extends PayloadMutator {
  public readonly subtask = AER_VOYAGES_SUB_TASK;
  public readonly step = AerVoyagesWizardStep.DELETE_VOYAGE;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Array<AerPortSummaryItemDto>,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.filter(
          (voyage) => !userInput.find((deletedVoyage) => deletedVoyage.uniqueIdentifier === voyage.uniqueIdentifier),
        );

        payload.aerSectionsCompleted[this.subtask] = !payload?.aer?.voyageEmissions.voyages?.length
          ? undefined
          : TaskItemStatus.IN_PROGRESS;

        for (const deletedVoyages of userInput) {
          payload.aerSectionsCompleted[`${this.subtask}-voyage-${deletedVoyages.uniqueIdentifier}`] = undefined;
        }
      }),
    );
  }
}
