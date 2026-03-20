import { Observable, of } from 'rxjs';
import { produce, WritableDraft } from 'immer';

import { AerShipEmissions, EmissionsSources } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions';
import { AER_PORTS_SUB_TASK, isPortWizardCompleted } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import {
  AER_VOYAGES_SUB_TASK,
  isVoyageWizardCompleted,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  getAggregatedDataSectionKey,
  getPortsSectionKey,
  getShipsSectionKey,
  getVoyagesSectionKey,
} from '@requests/common/utils/section-key-builder.helper';
import { AllFuelOriginTypeName } from '@shared/types';
import { isNil } from '@shared/utils';

export class AerShipSummaryPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.SHIP_SUMMARY;

  apply(currentPayload: AerSubmitTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[getShipsSectionKey(userInput)] = TaskItemStatus.COMPLETED;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;

        const shipImoNumber = payload.aer.emissions.ships.find((ship) => ship.uniqueIdentifier === userInput)?.details
          ?.imoNumber;

        if (!shipImoNumber) {
          return;
        }

        this.updateVoyages(payload, shipImoNumber);
        this.updatePorts(payload, shipImoNumber);
        this.updateAggregatedData(payload, shipImoNumber);
      }),
    );
  }

  /**
   * Update the Voyage task and all Voyage keys in aerSectionsCompleted when:
   * The fuel combination of id, type, methaneSlip and emissionSourceName is not found into the equivalent ship.
   * If the keys are not already IN_PROGRESS.
   */
  private updateVoyages(payload: WritableDraft<AerSubmitTaskPayload>, shipImoNumber: string) {
    const voyages = payload?.aer.voyageEmissions?.voyages?.filter((voyage) => voyage?.imoNumber === shipImoNumber);
    const affectedVoyages: string[] = [];
    for (const voyage of voyages) {
      const ship = payload?.aer?.emissions?.ships?.find((ship) => ship?.details?.imoNumber === shipImoNumber);
      const allVoyagesFuelConsumptionsValid = voyage?.fuelConsumptions.every((fuelConsumption) =>
        this.emissionSourceFuelExists(
          ship,
          fuelConsumption?.fuelOriginTypeName?.uniqueIdentifier,
          (fuelConsumption?.fuelOriginTypeName as AllFuelOriginTypeName)?.type,
          fuelConsumption?.fuelOriginTypeName?.methaneSlip,
          fuelConsumption?.name,
        ),
      );

      if (!(allVoyagesFuelConsumptionsValid && isVoyageWizardCompleted(voyage))) {
        affectedVoyages.push(voyage?.uniqueIdentifier);
      }
    }

    affectedVoyages.forEach((uniqueIdentifier) => {
      if (payload.aerSectionsCompleted[getVoyagesSectionKey(uniqueIdentifier)] !== TaskItemStatus.IN_PROGRESS) {
        payload.aerSectionsCompleted[getVoyagesSectionKey(uniqueIdentifier)] = TaskItemStatus.NEEDS_REVIEW;
      }
    });

    if (affectedVoyages?.length && payload.aerSectionsCompleted[AER_VOYAGES_SUB_TASK] !== TaskItemStatus.IN_PROGRESS) {
      payload.aerSectionsCompleted[AER_VOYAGES_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  /**
   * Update the Port task and all Port keys in aerSectionsCompleted when:
   * The fuel combination of id, type, methaneSlip and emissionSourceName is not found in the equivalent ship.
   * If the keys are not already IN_PROGRESS.
   */
  private updatePorts(payload: WritableDraft<AerSubmitTaskPayload>, shipImoNumber: string) {
    const ports = payload?.aer.portEmissions?.ports?.filter((port) => port?.imoNumber === shipImoNumber);
    const affectedPorts: string[] = [];
    for (const port of ports) {
      const ship = payload?.aer?.emissions?.ships?.find((ship) => ship?.details?.imoNumber === shipImoNumber);
      const allPortsFuelConsumptionsValid = port?.fuelConsumptions.every((fuelConsumption) =>
        this.emissionSourceFuelExists(
          ship,
          fuelConsumption?.fuelOriginTypeName?.uniqueIdentifier,
          (fuelConsumption?.fuelOriginTypeName as AllFuelOriginTypeName)?.type,
          fuelConsumption?.fuelOriginTypeName?.methaneSlip,
          fuelConsumption?.name,
        ),
      );

      if (!(allPortsFuelConsumptionsValid && isPortWizardCompleted(port))) {
        affectedPorts.push(port?.uniqueIdentifier);
      }
    }

    affectedPorts.forEach((uniqueIdentifier) => {
      if (payload.aerSectionsCompleted[getPortsSectionKey(uniqueIdentifier)] !== TaskItemStatus.IN_PROGRESS) {
        payload.aerSectionsCompleted[getPortsSectionKey(uniqueIdentifier)] = TaskItemStatus.NEEDS_REVIEW;
      }
    });

    if (affectedPorts?.length && payload.aerSectionsCompleted[AER_PORTS_SUB_TASK] !== TaskItemStatus.IN_PROGRESS) {
      payload.aerSectionsCompleted[AER_PORTS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  /**
   * Update the AggregatedData task and all AggregatedData keys as long as an entry with a related shipImoNumber is found
   */
  private updateAggregatedData(payload: WritableDraft<AerSubmitTaskPayload>, shipImoNumber: string) {
    const affectedAggregatedData = payload?.aer.aggregatedData?.emissions?.filter(
      (data) => data?.imoNumber === shipImoNumber,
    );

    affectedAggregatedData.forEach((item) => {
      if (
        payload.aerSectionsCompleted[getAggregatedDataSectionKey(item?.uniqueIdentifier)] !== TaskItemStatus.IN_PROGRESS
      ) {
        payload.aerSectionsCompleted[getAggregatedDataSectionKey(item?.uniqueIdentifier)] = TaskItemStatus.NEEDS_REVIEW;
      }
    });

    if (
      affectedAggregatedData?.length &&
      payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] !== TaskItemStatus.IN_PROGRESS
    ) {
      payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
    }
  }

  /**
   * Check whether the fuel combination of id, type, methaneSlip and emissionSourceName is found in the equivalent ship.
   */
  private emissionSourceFuelExists(
    ship: AerShipEmissions,
    fuelId: AllFuelOriginTypeName['uniqueIdentifier'],
    fuelType: AllFuelOriginTypeName['type'],
    fuelMethaneSlip?: AllFuelOriginTypeName['methaneSlip'],
    emissionSourceName?: EmissionsSources['name'],
  ) {
    return ship?.emissionsSources?.some((source) => {
      const emissionSourceNameFound = isNil(emissionSourceName) ? true : source?.name === emissionSourceName;
      return (
        emissionSourceNameFound &&
        source?.fuelDetails?.some((fuel) => {
          const methaneSlipValid = isNil(fuelMethaneSlip) ? true : fuel?.methaneSlip === fuelMethaneSlip;
          return (
            methaneSlipValid && (fuel as AllFuelOriginTypeName)?.type === fuelType && fuel?.uniqueIdentifier === fuelId
          );
        })
      );
    });
  }
}
