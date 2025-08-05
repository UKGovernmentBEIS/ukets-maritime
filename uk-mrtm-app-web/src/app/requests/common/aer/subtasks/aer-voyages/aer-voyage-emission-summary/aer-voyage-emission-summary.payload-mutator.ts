import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerPort } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageEmissionSummaryPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_VOYAGES_SUB_TASK;
  public readonly step = AerVoyagesWizardStep.FUEL_EMISSIONS_SUMMARY;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerPort['uniqueIdentifier'],
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
