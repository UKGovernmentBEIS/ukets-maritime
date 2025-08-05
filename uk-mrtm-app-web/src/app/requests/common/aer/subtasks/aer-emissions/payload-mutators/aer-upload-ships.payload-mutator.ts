import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AerEmissionsWizardStep,
  isShipWizardCompleted,
} from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerUploadShipsPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.UPLOAD_SHIPS;

  apply(currentPayload: AerSubmitTaskPayload, userInput: AerShipEmissions[]): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer[this.subtask] = {
          ships: userInput,
        };
        userInput.forEach((ship) => {
          payload.aerSectionsCompleted[`${this.subtask}-ship-${ship.uniqueIdentifier}`] = isShipWizardCompleted(ship)
            ? TaskItemStatus.COMPLETED
            : TaskItemStatus.IN_PROGRESS;
        });

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
