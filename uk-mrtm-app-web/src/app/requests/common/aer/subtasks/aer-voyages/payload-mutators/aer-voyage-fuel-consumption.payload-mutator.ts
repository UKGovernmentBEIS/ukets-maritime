import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { FuelOriginTypeName } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerFuelConsumptionFormModel } from '@requests/common/aer/components';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageFuelConsumptionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_VOYAGES_SUB_TASK;
  public readonly step: string = AerVoyagesWizardStep.FUEL_CONSUMPTION;

  public apply(currentPayload: AerSubmitTaskPayload, userInput: AerFuelConsumptionFormModel): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const {
          uniqueIdentifier,
          fuelOrigin,
          objectId,
          fuelDensity: userInputFuelDensity,
          name,
          amount,
          measuringUnit,
          totalConsumption,
          methaneSlip,
        } = userInput;

        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions.voyages.map((voyage) => {
          if (voyage.uniqueIdentifier !== objectId) {
            return voyage;
          }

          const fuelOriginType = payload?.aer?.emissions?.ships
            ?.map((x) => x.fuelsAndEmissionsFactors ?? [])
            .flat()
            .find((x) => x.uniqueIdentifier === fuelOrigin);

          const fuelOriginTypeName = {
            origin: fuelOriginType.origin,
            name: fuelOriginType.name,
            type: (fuelOriginType as any).type,
            uniqueIdentifier: fuelOriginType.uniqueIdentifier,
            methaneSlip: methaneSlip,
          } as FuelOriginTypeName;

          const fuelDensity = measuringUnit === 'M3' ? userInputFuelDensity : undefined;

          const fuelConsumption = (voyage.fuelConsumptions ?? []).find(
            (item) => item.uniqueIdentifier === uniqueIdentifier,
          );

          return {
            ...voyage,
            fuelConsumptions: fuelConsumption
              ? voyage.fuelConsumptions.map((item) =>
                  item?.uniqueIdentifier === uniqueIdentifier
                    ? {
                        uniqueIdentifier: uniqueIdentifier,
                        fuelOriginTypeName: fuelOriginTypeName,
                        name: name,
                        amount: amount,
                        measuringUnit: measuringUnit,
                        fuelDensity: fuelDensity,
                        totalConsumption: totalConsumption,
                      }
                    : item,
                )
              : [
                  ...(voyage.fuelConsumptions ?? []),
                  {
                    uniqueIdentifier: uniqueIdentifier,
                    fuelOriginTypeName: fuelOriginTypeName,
                    name: name,
                    amount: amount,
                    measuringUnit: measuringUnit,
                    fuelDensity: fuelDensity,
                    totalConsumption: totalConsumption,
                  },
                ],
          };
        });

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-voyage-${userInput.objectId}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
