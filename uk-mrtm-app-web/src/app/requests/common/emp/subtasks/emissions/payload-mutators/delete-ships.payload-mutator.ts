import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class DeleteShipsPayloadMutator extends PayloadMutator {
  readonly subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.DELETE_SHIPS;

  apply(currentPayload: EmpTaskPayload, userInput: Array<EmpShipEmissions['uniqueIdentifier']>): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.filter(
            (ship: EmpShipEmissions) => !userInput.includes(ship.uniqueIdentifier),
          ),
        ];

        userInput.forEach((uniqueIdentifier) => {
          if (payload.empSectionsCompleted[`${this.subtask}-ship-${uniqueIdentifier}`]) {
            delete payload.empSectionsCompleted[`${this.subtask}-ship-${uniqueIdentifier}`];
          }
        });

        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
