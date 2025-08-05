import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerAggregatedDataWizardStep } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerAggregatedDataEmissionsForSmallIslandFormModel } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-emissions-for-small-island/aer-aggregated-data-emissions-for-small-island.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataEmissionsForSmallIslandPayloadMutator extends PayloadMutator {
  public readonly subtask: string = AER_AGGREGATED_DATA_SUB_TASK;
  public readonly step: string = AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS;

  public apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: AerAggregatedDataEmissionsForSmallIslandFormModel,
  ): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        const { uniqueIdentifier, ...userInputEmissions } = userInput;

        payload.aer.aggregatedData.emissions = payload.aer.aggregatedData.emissions.map((emission) =>
          emission.uniqueIdentifier === uniqueIdentifier
            ? {
                ...emission,
                ...userInputEmissions,
              }
            : emission,
        );

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${userInput.uniqueIdentifier}`] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
