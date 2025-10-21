import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ShipDetailsFormModel } from '@requests/common/components/emissions/basic-ship-details';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class BasicShipDetailPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.BASIC_DETAILS;

  apply(currentPayload: EmpTaskPayload, userInput: ShipDetailsFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { uniqueIdentifier, ...details } = userInput;
        const editedShip = payload.emissionsMonitoringPlan[this.subtask]?.ships?.find(
          (x) => x.uniqueIdentifier === uniqueIdentifier,
        );

        if (!isNil(editedShip)) {
          payload.emissionsMonitoringPlan[this.subtask].ships = [
            ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
              ship.uniqueIdentifier !== uniqueIdentifier
                ? ship
                : {
                    ...ship,
                    details,
                  },
            ),
          ];
        } else {
          payload.emissionsMonitoringPlan[this.subtask] = {
            ships: [
              ...(payload.emissionsMonitoringPlan[this.subtask]?.ships ?? []),
              {
                uniqueIdentifier,
                details,
                fuelsAndEmissionsFactors: [],
                emissionsSources: [],
              },
            ],
          };
        }

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput.uniqueIdentifier}`] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
