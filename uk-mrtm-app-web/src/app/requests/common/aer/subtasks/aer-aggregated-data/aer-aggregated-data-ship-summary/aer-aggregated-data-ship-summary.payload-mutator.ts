import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerShipAggregatedData } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataShipSummaryPayloadMutator extends PayloadMutator {
  public readonly subtask = AER_AGGREGATED_DATA_SUB_TASK;
  public readonly step = AerAggregatedDataWizardStep.AGGREGATED_DATA_SUMMARY;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerShipAggregatedData['uniqueIdentifier'],
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${userInput}`] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
