import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerVoyageAggregatedDataSideEffect extends SideEffect {
  public readonly subtask = AER_VOYAGES_SUB_TASK;
  public readonly step = undefined;
  public readonly on = ['SAVE_SUBTASK'];

  public override apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const relatedAggregatedData = payload?.aer?.aggregatedData?.emissions?.filter((data) => data.fromFetch);

        for (const data of relatedAggregatedData) {
          const associatedPortCall = payload?.aer?.voyageEmissions?.voyages?.find(
            (voyage) => voyage.imoNumber === data.imoNumber,
          );

          if (
            isNil(associatedPortCall) ||
            payload.aerSectionsCompleted?.[`${this.subtask}-voyage-${associatedPortCall.uniqueIdentifier}`] !==
              TaskItemStatus.COMPLETED
          ) {
            payload.aerSectionsCompleted[`${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${data.uniqueIdentifier}`] =
              TaskItemStatus.NEEDS_REVIEW;
            payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
          }
        }
      }),
    );
  }
}
