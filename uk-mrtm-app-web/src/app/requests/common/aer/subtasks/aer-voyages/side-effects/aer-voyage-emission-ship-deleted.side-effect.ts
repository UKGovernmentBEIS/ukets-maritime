import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { LIST_OF_SHIPS_DELETE_STEP } from '@requests/common/components/emissions/delete-ships/delete-ships.helper';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageEmissionShipDeletedSideEffect extends SideEffect {
  public readonly subtask = EMISSIONS_SUB_TASK;
  public readonly step = LIST_OF_SHIPS_DELETE_STEP;

  public apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        if (!payload?.aer?.voyageEmissions?.voyages?.length) {
          return;
        }

        const ships = (payload.aer?.emissions?.ships ?? []).map((x) => x.details?.imoNumber).filter(Boolean);
        const voyagesToDelete = payload.aer.voyageEmissions?.voyages
          .filter((voyage) => !ships.includes(voyage?.imoNumber))
          .map((x) => x.uniqueIdentifier);

        if (!voyagesToDelete.length) {
          return;
        }

        payload.aer.voyageEmissions.voyages = payload.aer.voyageEmissions?.voyages.filter(
          (x) => !voyagesToDelete.includes(x.uniqueIdentifier),
        );

        for (const voyage of voyagesToDelete) {
          payload.aerSectionsCompleted[`${AER_VOYAGES_SUB_TASK}-voyage-${voyage}`] = undefined;
        }

        payload.aerSectionsCompleted[AER_VOYAGES_SUB_TASK] = payload.aer.portEmissions.ports.length
          ? TaskItemStatus.NEEDS_REVIEW
          : undefined;
      }),
    );
  }
}
