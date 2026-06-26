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

export const provideAerAggregatedDataShipSummaryPayloadMutator = (
  step: AerAggregatedDataWizardStep.NEW_AGGREGATED_DATA_SUMMARY | AerAggregatedDataWizardStep.AGGREGATED_DATA_SUMMARY,
): PayloadMutator =>
  ({
    subtask: AER_AGGREGATED_DATA_SUB_TASK,
    step,
    apply: (
      currentPayload: AerSubmitTaskPayload,
      userInput: AerShipAggregatedData['uniqueIdentifier'],
    ): Observable<AerSubmitTaskPayload> => {
      return of(
        produce(currentPayload, (payload: AerSubmitTaskPayload) => {
          payload.aerSectionsCompleted[AER_AGGREGATED_DATA_SUB_TASK] = TaskItemStatus.IN_PROGRESS;
          payload.aerSectionsCompleted[`${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${userInput}`] =
            TaskItemStatus.COMPLETED;
        }),
      );
    },
  }) as PayloadMutator;
