import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { UncertaintyLevelModel } from '@requests/common/components/emissions/uncertainty-level/uncertainty-level.types';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class UncertaintyLevelPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.UNCERTAINTY_LEVEL;

  apply(currentPayload: EmpTaskPayload, userInput: UncertaintyLevelModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { shipId, uncertaintyLevels } = userInput;
        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
            ship.uniqueIdentifier !== shipId
              ? ship
              : {
                  ...ship,
                  uncertaintyLevel: uncertaintyLevels,
                },
          ),
        ];

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
