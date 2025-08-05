import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { FuelOriginTypeName } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerFuelConsumptionFormModel } from '@requests/common/aer/components';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerPortFuelConsumptionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_PORTS_SUB_TASK;
  public readonly step: string = AerPortsWizardStep.FUEL_CONSUMPTION;

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

        payload.aer.portEmissions.ports = payload.aer.portEmissions.ports.map((port) => {
          if (port.uniqueIdentifier !== objectId) {
            return port;
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

          const fuelConsumption = (port.fuelConsumptions ?? []).find(
            (item) => item.uniqueIdentifier === uniqueIdentifier,
          );

          return {
            ...port,
            fuelConsumptions: fuelConsumption
              ? port.fuelConsumptions.map((item) =>
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
                  ...(port.fuelConsumptions ?? []),
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
        payload.aerSectionsCompleted[`${this.subtask}-port-call-${userInput.objectId}`] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
