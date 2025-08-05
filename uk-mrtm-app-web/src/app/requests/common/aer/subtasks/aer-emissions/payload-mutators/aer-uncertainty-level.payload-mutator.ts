import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { UncertaintyLevelModel } from '@requests/common/components/emissions';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerUncertaintyLevelPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.UNCERTAINTY_LEVEL;

  apply(currentPayload: AerSubmitTaskPayload, userInput: UncertaintyLevelModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { shipId, uncertaintyLevels } = userInput;
        const editedShip = payload.aer[this.subtask]?.ships?.find((ship) => ship.uniqueIdentifier === shipId);

        payload.aer[this.subtask].ships = payload.aer[this.subtask].ships.map((ship) =>
          ship.uniqueIdentifier === shipId ? { ...editedShip, uncertaintyLevel: uncertaintyLevels } : ship,
        );

        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
