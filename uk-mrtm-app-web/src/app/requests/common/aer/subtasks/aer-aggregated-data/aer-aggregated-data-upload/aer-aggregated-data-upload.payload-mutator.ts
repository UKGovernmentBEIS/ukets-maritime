import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { AerShipAggregatedData, AerShipAggregatedDataSave } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AerAggregatedDataUploadPayloadMutator extends PayloadMutator {
  readonly subtask = AER_AGGREGATED_DATA_SUB_TASK;
  step = AerAggregatedDataWizardStep.UPLOAD_AGGREGATED_DATA;

  apply(currentPayload: AerSubmitTaskPayload, userInput: AerShipAggregatedDataSave[]): Observable<any> {
    return of(
      produce(currentPayload, (payload: AerSubmitTaskPayload) => {
        payload.aer[this.subtask] = {
          emissions: userInput as AerShipAggregatedData[],
        };

        /**
         * Delete all existing sectionsCompleted keys for aggregated-data,
         * since the upload operation completely overwrites all previous aggregatedData
         */
        for (const key of Object.keys(payload.aerSectionsCompleted)) {
          if (key.startsWith(`${this.subtask}-aggregated-data-`)) {
            delete payload.aerSectionsCompleted[key];
          }
        }

        /**
         * Mark all new aggregated data as completed as they have been validated through XML validators
         */
        userInput.forEach((ship) => {
          payload.aerSectionsCompleted[`${this.subtask}-aggregated-data-${ship.uniqueIdentifier}`] =
            TaskItemStatus.COMPLETED;
        });

        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
