import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { SideEffect, SubtaskOperation } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents/additional-documents.helper';

export class AerAdditionalDocumentsSummarySideEffect extends SideEffect {
  step = undefined;
  subtask = ADDITIONAL_DOCUMENTS_SUB_TASK;
  on: SubtaskOperation[] = ['SUBMIT_SUBTASK'];

  override apply(currentPayload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.COMPLETED;
      }),
    );
  }
}
