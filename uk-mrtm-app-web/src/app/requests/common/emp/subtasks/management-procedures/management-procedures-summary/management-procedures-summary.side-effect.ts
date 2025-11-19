import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class ManagementProceduresSummarySideEffect extends SideEffect {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  step = null;
  subtask = MANAGEMENT_PROCEDURES_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(
    currentPayload: EmpIssuanceApplicationSubmitRequestTaskPayload,
  ): Observable<EmpIssuanceApplicationSubmitRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.COMPLETED;
      }),
    );
  }
}
