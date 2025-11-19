import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpVariationRegulatorTaskPayload } from '@requests/common/emp/emp.types';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class VariationDetailsReasonNoticePayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = VARIATION_DETAILS_SUB_TASK;
  step = VariationDetailsWizardStep.REASON_NOTICE;

  public apply(
    currentPayload: EmpVariationRegulatorTaskPayload,
    userInput: EmpVariationRegulatorLedReason,
  ): Observable<EmpVariationRegulatorTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reasonRegulatorLed = {
          ...payload.reasonRegulatorLed,
          ...userInput,
        };
        payload.empVariationDetailsCompleted = TaskItemStatus.IN_PROGRESS;
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
