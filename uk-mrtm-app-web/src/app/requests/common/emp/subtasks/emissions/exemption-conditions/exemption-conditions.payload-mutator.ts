import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { ExemptionConditionsFormType } from '@requests/common/emp/subtasks/emissions/exemption-conditions/exemption-conditions.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ExemptionConditionsPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.EXEMPTION_CONDITIONS;

  apply(currentPayload: EmpTaskPayload, userInput: ExemptionConditionsFormType): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { shipId, ...exemptionConditions } = userInput;

        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
            ship.uniqueIdentifier !== shipId
              ? ship
              : {
                  ...ship,
                  exemptionConditions,
                },
          ),
        ];

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
