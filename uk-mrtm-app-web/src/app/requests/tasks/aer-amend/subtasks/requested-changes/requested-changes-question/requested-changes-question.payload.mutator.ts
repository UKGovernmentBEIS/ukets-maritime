import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import {
  REQUESTED_CHANGES_SUB_TASK,
  RequestedChangesWizardStep,
} from '@requests/common/emp/subtasks/requested-changes/requested-changes.helpers';
import { RequestedChangesUserInput } from '@requests/common/emp/subtasks/requested-changes/requested-changes-question/requested-changes-question.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerAmendTaskPayload } from '@requests/tasks/aer-amend/aer-amend.types';

export class AerRequestedChangesQuestionPayloadMutator extends PayloadMutator {
  subtask = REQUESTED_CHANGES_SUB_TASK;
  step = RequestedChangesWizardStep.REQUESTED_CHANGES_AGREEMENT;

  apply(currentPayload: AerAmendTaskPayload, userInput: RequestedChangesUserInput): Observable<AerAmendTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.aerSectionsCompleted = {
          ...payload.aerSectionsCompleted,
          [REQUESTED_CHANGES_SUB_TASK]: userInput?.accepted ? TaskItemStatus.COMPLETED : TaskItemStatus.NOT_STARTED,
        };
      }),
    );
  }
}
