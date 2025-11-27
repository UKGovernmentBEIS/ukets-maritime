import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerAggregatedDataWizardStep } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerAggregatedDataFuelConsumptionFormModel } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-fuel-consumption/aer-aggregated-data-fuel-consumption.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataFuelConsumptionPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;
  public readonly step: string = AerAggregatedDataWizardStep.FUEL_CONSUMPTION;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerAggregatedDataFuelConsumptionFormModel,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, fuelConsumptions } = userInput;

        const usedFuelOrigins = fuelConsumptions.map((x) => x.fuelOriginTypeName);
        const relatedFuelOrigins = payload.aer.emissions.ships
          .map((x) => x.fuelsAndEmissionsFactors)
          .flat()
          .filter((x) => usedFuelOrigins.includes(x.uniqueIdentifier))
          .map((fuelOrigin) => ({
            origin: fuelOrigin.origin,
            name: fuelOrigin.name,
            type: (fuelOrigin as any).type,
            uniqueIdentifier: fuelOrigin.uniqueIdentifier,
          }));

        payload.aer.aggregatedData.emissions = payload.aer.aggregatedData.emissions.map((aggregatedData) => {
          if (aggregatedData.uniqueIdentifier !== uniqueIdentifier) {
            return aggregatedData;
          }

          return {
            ...aggregatedData,
            fuelConsumptions: fuelConsumptions.map((consumption) => ({
              fuelOriginTypeName: relatedFuelOrigins.find((x) => x.uniqueIdentifier === consumption.fuelOriginTypeName),
              totalConsumption: consumption.totalConsumption,
            })),
          };
        });

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${userInput.uniqueIdentifier}`] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
