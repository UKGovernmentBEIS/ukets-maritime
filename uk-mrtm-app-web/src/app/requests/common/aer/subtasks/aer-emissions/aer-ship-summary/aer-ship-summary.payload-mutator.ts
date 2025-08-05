import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerShipSummaryPayloadMutator extends PayloadMutator {
  subtask = EMISSIONS_SUB_TASK;
  step = AerEmissionsWizardStep.SHIP_SUMMARY;

  apply(currentPayload: AerSubmitTaskPayload, userInput: string): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[`${this.subtask}-ship-${userInput}`] = TaskItemStatus.COMPLETED;
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;

        const shipImoNumber = payload.aer.emissions.ships.find((ship) => ship.uniqueIdentifier === userInput)?.details
          ?.imoNumber;

        if (!shipImoNumber) {
          return;
        }

        const ports = payload.aer.portEmissions?.ports
          ?.filter((port) => port.imoNumber === shipImoNumber)
          .map((port) => `${AER_PORTS_SUB_TASK}-port-call-${port.uniqueIdentifier}`);

        const voyages = payload.aer.voyageEmissions?.voyages
          ?.filter((voyage) => voyage.imoNumber === shipImoNumber)
          .map((voyage) => `${AER_VOYAGES_SUB_TASK}-voyage-${voyage.uniqueIdentifier}`);

        const aggregatedData = payload.aer.aggregatedData?.emissions
          .filter((aggregatedData) => aggregatedData.imoNumber === shipImoNumber)
          .map((data) => `${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${data.uniqueIdentifier}`);

        for (const key of [
          ...ports,
          ...voyages,
          ...aggregatedData,
          ports?.length ? AER_PORTS_SUB_TASK : undefined,
          voyages?.length ? AER_VOYAGES_SUB_TASK : undefined,
          aggregatedData?.length ? AER_AGGREGATED_DATA_SUB_TASK : undefined,
        ].filter(Boolean)) {
          payload.aerSectionsCompleted[key] = TaskItemStatus.NEEDS_REVIEW;
        }
      }),
    );
  }
}
