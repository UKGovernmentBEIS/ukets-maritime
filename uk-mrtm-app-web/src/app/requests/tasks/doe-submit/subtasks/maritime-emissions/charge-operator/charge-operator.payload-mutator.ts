import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';

export class ChargeOperatorPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = MARITIME_EMISSIONS_SUB_TASK;
  step = MaritimeEmissionsWizardStep.CHARGE_OPERATOR;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: DoeTaskPayload, userInput: { chargeOperator: boolean }): Observable<DoeTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        if (userInput?.chargeOperator === false) {
          delete payload.doe?.maritimeEmissions?.feeDetails;
        }
        payload.doe = {
          maritimeEmissions: {
            ...payload.doe?.maritimeEmissions,
            ...userInput,
          },
        };
        payload.sectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
