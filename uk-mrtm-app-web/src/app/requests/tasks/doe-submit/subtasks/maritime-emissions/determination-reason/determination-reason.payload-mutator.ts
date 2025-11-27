import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { DoeDeterminationReason } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';

export class DeterminationReasonPayloadMutator extends PayloadMutator {
  subtask = MARITIME_EMISSIONS_SUB_TASK;
  step = MaritimeEmissionsWizardStep.DETERMINATION_REASON;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: DoeTaskPayload, userInput: DoeDeterminationReason): Observable<DoeTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.doe = {
          maritimeEmissions: {
            ...payload.doe?.maritimeEmissions,
            determinationReason: userInput,
          },
        };
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
