import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { DoeFeeDetails, DoeMaritimeEmissions } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';

export class FeeDetailsPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = MARITIME_EMISSIONS_SUB_TASK;
  step = MaritimeEmissionsWizardStep.FEE_DETAILS;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: DoeTaskPayload, userInput: DoeFeeDetails): Observable<DoeTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.doe = {
          maritimeEmissions: {
            ...payload.doe?.maritimeEmissions,
            feeDetails: userInput,
          } as DoeMaritimeEmissions,
        };
        payload.sectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
