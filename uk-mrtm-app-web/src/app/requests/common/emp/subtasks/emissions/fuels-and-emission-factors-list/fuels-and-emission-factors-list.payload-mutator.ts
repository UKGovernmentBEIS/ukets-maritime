import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpFuelsAndEmissionsFactors, EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { getShipsSectionKey } from '@requests/common/utils/section-key-builder.helper';

export class FuelsAndEmissionFactorsListPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST;

  apply(
    currentPayload: EmpTaskPayload,
    userInput: {
      shipId: EmpShipEmissions['uniqueIdentifier'];
      fuelId: EmpFuelsAndEmissionsFactors['uniqueIdentifier'];
    },
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        payload.emissionsMonitoringPlan[this.subtask].ships = [
          ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) => ({
            ...ship,
            fuelsAndEmissionsFactors: ship.fuelsAndEmissionsFactors.filter(
              (factor: EmpFuelsAndEmissionsFactors) => factor.uniqueIdentifier !== userInput.fuelId,
            ),
          })),
        ];

        payload.empSectionsCompleted[getShipsSectionKey(userInput.shipId)] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
