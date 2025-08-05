import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { EmpFuelsAndEmissionsFactors, EmpShipEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpFuelsAndEmissionsFactorsFormType } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class FuelsAndEmissionFactorsFormPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM;

  apply(currentPayload: EmpTaskPayload, userInput: EmpFuelsAndEmissionsFactorsFormType): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { uniqueIdentifier, shipId, ...formData } = userInput;
        const editedShip = payload.emissionsMonitoringPlan[this.subtask]?.ships?.find(
          (x: EmpShipEmissions) => x.uniqueIdentifier === shipId,
        );
        const factor = editedShip.fuelsAndEmissionsFactors.find(
          (factor: EmpFuelsAndEmissionsFactors) => factor.uniqueIdentifier === uniqueIdentifier,
        );
        if (formData.type !== 'OTHER') {
          delete formData.name;
        }
        if ((formData?.nitrousOxide as any) === 'OTHER') {
          formData.nitrousOxide = formData.otherNitrousOxide;
        }
        delete formData?.otherNitrousOxide;

        if (isNil(factor)) {
          payload.emissionsMonitoringPlan[this.subtask].ships = [
            ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
              ship.uniqueIdentifier !== shipId
                ? ship
                : {
                    ...ship,
                    fuelsAndEmissionsFactors: [
                      ...ship.fuelsAndEmissionsFactors,
                      {
                        ...formData,
                        uniqueIdentifier,
                      },
                    ],
                  },
            ),
          ];
        } else {
          payload.emissionsMonitoringPlan[this.subtask].ships = [
            ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) => ({
              ...ship,
              fuelsAndEmissionsFactors: ship.fuelsAndEmissionsFactors.map((factor: EmpFuelsAndEmissionsFactors) =>
                factor.uniqueIdentifier !== uniqueIdentifier
                  ? factor
                  : {
                      ...formData,
                      uniqueIdentifier,
                    },
              ),
            })),
          ];
        }

        payload.empSectionsCompleted[`${this.subtask}-ship-${userInput.shipId}`] = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
