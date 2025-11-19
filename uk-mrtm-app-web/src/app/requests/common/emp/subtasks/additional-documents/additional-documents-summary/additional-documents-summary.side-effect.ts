import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceApplicationSubmitRequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';

export class AdditionalDocumentsSummarySideEffect extends SideEffect {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  step = undefined;
  subtask = ADDITIONAL_DOCUMENTS_SUB_TASK;
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
