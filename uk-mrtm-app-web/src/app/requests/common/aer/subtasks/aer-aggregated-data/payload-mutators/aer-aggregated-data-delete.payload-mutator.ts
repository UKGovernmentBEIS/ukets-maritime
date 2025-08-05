import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerAggregatedDataSummaryItemDto } from '@shared/types';

export class AerAggregatedDataDeletePayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;
  public readonly step: string = AerAggregatedDataWizardStep.DELETE_AGGREGATED_DATA;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Array<AerAggregatedDataSummaryItemDto>,
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer.aggregatedData.emissions = payload.aer.aggregatedData.emissions.filter(
          (data) => !userInput.find((deletedVoyage) => deletedVoyage.uniqueIdentifier === data.uniqueIdentifier),
        );

        payload.aerSectionsCompleted[this.subtask] = !payload?.aer?.aggregatedData?.emissions?.length
          ? undefined
          : TaskItemStatus.IN_PROGRESS;

        for (const deletedData of userInput) {
          payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${deletedData.uniqueIdentifier}`] = undefined;
        }
      }),
    );
  }
}
