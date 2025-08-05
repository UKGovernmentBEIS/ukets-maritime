import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';
import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  ResponseWizardStep,
} from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class ResponsePayloadMutator extends PayloadMutator {
  subtask = FOLLOW_UP_RESPONSE_SUB_TASK;
  step = ResponseWizardStep.FOLLOW_UP_RESPONSE;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(
    currentPayload: FollowUpAmendTaskPayload,
    userInput: { response: string; files: UploadedFile[] },
  ): Observable<FollowUpAmendTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.followUpResponse = userInput.response;
        payload.followUpFiles = createFileUploadPayload(userInput.files);
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
        payload.followUpAttachments = {
          ...payload.followUpAttachments,
          ...transformToTaskAttachments(userInput.files),
        };
      }),
    );
  }
}
