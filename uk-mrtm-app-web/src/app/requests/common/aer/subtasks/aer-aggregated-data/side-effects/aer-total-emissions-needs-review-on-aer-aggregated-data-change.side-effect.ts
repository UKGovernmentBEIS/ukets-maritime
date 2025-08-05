import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerTotalEmissionsNeedsReviewOnAerAggregatedDataChangeSideEffect extends SideEffect {
  readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;
  readonly step: string = undefined;
  readonly on = ['SAVE_SUBTASK', 'SUBMIT_SUBTASK'];

  apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        if (payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] === TaskItemStatus.COMPLETED) {
          payload.aerSectionsCompleted[AER_TOTAL_EMISSIONS_SUB_TASK] = TaskItemStatus.NEEDS_REVIEW;
        }
      }),
    );
  }
}
