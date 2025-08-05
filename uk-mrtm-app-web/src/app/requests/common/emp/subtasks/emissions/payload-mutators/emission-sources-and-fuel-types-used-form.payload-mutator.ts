import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { EmpEmissionsSources, EmpShipEmissions, FuelOriginFossilTypeName } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { getMethaneSlipFromUserInput } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { EmissionSourcesAndFuelTypesUsedFormType } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.types';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class EmissionSourcesAndFuelTypesUsedPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = EmissionsWizardStep.EMISSION_SOURCES_FORM;

  public apply(currentPayload: any, userInput: EmissionSourcesAndFuelTypesUsedFormType): Observable<any> {
    return of(
      produce(currentPayload, (payload: EmpTaskPayload) => {
        const { uniqueIdentifier, shipId, fuelDetails, ...formData } = userInput;

        const editedShip = payload.emissionsMonitoringPlan[this.subtask]?.ships?.find(
          (x: EmpShipEmissions) => x.uniqueIdentifier === shipId,
        );

        const emissionSource = editedShip.emissionsSources.find(
          (item: EmpEmissionsSources) => item.uniqueIdentifier === uniqueIdentifier,
        );

        const fuelDetailsDto: FuelOriginFossilTypeName[] = fuelDetails.map((fuelDetail) => {
          const { methaneSlipValue, methaneSlipValueType } = getMethaneSlipFromUserInput(
            fuelDetail?.methaneSlip,
            fuelDetail?.methaneSlipOther,
          );

          const fuelFactor = editedShip.fuelsAndEmissionsFactors.find(
            (item) => item.uniqueIdentifier === fuelDetail.uniqueIdentifier,
          );
          return {
            uniqueIdentifier: fuelDetail.uniqueIdentifier,
            origin: fuelFactor.origin,
            name: fuelFactor.name,
            type: fuelFactor.type,
            methaneSlip: methaneSlipValue,
            methaneSlipValueType: methaneSlipValueType,
          } as FuelOriginFossilTypeName;
        });

        if (isNil(emissionSource)) {
          payload.emissionsMonitoringPlan[this.subtask].ships = [
            ...payload.emissionsMonitoringPlan[this.subtask].ships.map((ship: EmpShipEmissions) =>
              ship.uniqueIdentifier !== shipId
                ? ship
                : {
                    ...ship,
                    emissionsSources: [
                      ...ship.emissionsSources,
                      {
                        ...formData,
                        fuelDetails: fuelDetailsDto,
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
              emissionsSources: ship.emissionsSources.map((item: EmpEmissionsSources) =>
                item.uniqueIdentifier !== uniqueIdentifier
                  ? item
                  : {
                      ...formData,
                      fuelDetails: fuelDetailsDto,
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
