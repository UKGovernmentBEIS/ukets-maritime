import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerDirectEmissionsFormModel } from '@requests/common/aer/components/aer-direct-emission/aer-direct-emission.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageDirectEmissionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  public readonly step: string = AerVoyagesWizardStep.DIRECT_EMISSIONS;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerDirectEmissionsFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...directEmissions } = userInput;

        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.map((voyage) =>
          voyage.uniqueIdentifier === uniqueIdentifier
            ? {
                ...voyage,
                directEmissions: {
                  ...directEmissions,
                },
              }
            : voyage,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
