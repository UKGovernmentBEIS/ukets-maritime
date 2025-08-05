import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { LIST_OF_SHIPS_DELETE_STEP } from '@requests/common/components/emissions/delete-ships/delete-ships.helper';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataShipDeletedSideEffect extends SideEffect {
  public readonly subtask = EMISSIONS_SUB_TASK;
  public readonly step = LIST_OF_SHIPS_DELETE_STEP;

  public apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        if (!payload?.aer?.portEmissions?.ports?.length) {
          return;
        }

        const ships = (payload.aer?.emissions?.ships ?? []).map((x) => x.details?.imoNumber).filter(Boolean);
        const aggregatedDataToDelete = payload.aer?.aggregatedData?.emissions
          ?.filter((aggregatedData) => !ships.includes(aggregatedData?.imoNumber))
          ?.map((x) => x.uniqueIdentifier);

        if (!aggregatedDataToDelete?.length) {
          return;
        }

        payload.aer.aggregatedData.emissions = payload.aer.aggregatedData.emissions.filter(
          (aggregatedData) => !aggregatedDataToDelete.includes(aggregatedData.uniqueIdentifier),
        );

        for (const aggregatedData of aggregatedDataToDelete) {
          payload.aerSectionsCompleted[`${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${aggregatedData}`] = undefined;
        }

        if (payload.aer.aggregatedData.emissions.length) {
          payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;

          if (payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] === TaskItemStatus.COMPLETED) {
            payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
          }
        } else {
          payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = undefined;
          payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = undefined;
        }
      }),
    );
  }
}
