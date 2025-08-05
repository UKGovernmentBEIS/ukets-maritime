import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { EmpAmendTaskPayload } from '@requests/common/emp/emp.types';
import {
  REQUESTED_CHANGES_SUB_TASK,
  RequestedChangesWizardStep,
} from '@requests/common/emp/subtasks/requested-changes/requested-changes.helpers';
import { RequestedChangesUserInput } from '@requests/common/emp/subtasks/requested-changes/requested-changes-question/requested-changes-question.types';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class RequestedChangesQuestionPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });

  subtask = REQUESTED_CHANGES_SUB_TASK;
  step = RequestedChangesWizardStep.REQUESTED_CHANGES_AGREEMENT;

  apply(currentPayload: EmpAmendTaskPayload, userInput: RequestedChangesUserInput): Observable<any> {
    return of(
      produce(currentPayload, (payload) => {
        payload.empSectionsCompleted = {
          ...payload.empSectionsCompleted,
          [this.sectionsCompletedMap?.[REQUESTED_CHANGES_SUB_TASK] ?? REQUESTED_CHANGES_SUB_TASK]: userInput?.accepted
            ? TaskItemStatus.COMPLETED
            : TaskItemStatus.NOT_STARTED,
        };
      }),
    );
  }
}
