import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AbbreviationsSummarySideEffect extends SideEffect {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  step = undefined;
  subtask = ABBREVIATIONS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpIssuanceApplicationSubmitRequestTaskPayload,
  ): Observable<EmpIssuanceApplicationSubmitRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.COMPLETED;
      }),
    );
  }
}
