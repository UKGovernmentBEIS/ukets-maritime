import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerDeleteShipsPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.DELETE_SHIPS;

  apply(currentPayload: AerSubmitTaskPayload, userInput: Array<AerShipEmissions['uniqueIdentifier']>): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer[this.subtask].ships = [
          ...payload.aer[this.subtask].ships.filter((ship) => !userInput.includes(ship.uniqueIdentifier)),
        ];

        userInput.forEach((uniqueIdentifier) => {
          if (payload.aerSectionsCompleted[`${this.subtask}-ship-${uniqueIdentifier}`]) {
            delete payload.aerSectionsCompleted[`${this.subtask}-ship-${uniqueIdentifier}`];
          }
        });

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
