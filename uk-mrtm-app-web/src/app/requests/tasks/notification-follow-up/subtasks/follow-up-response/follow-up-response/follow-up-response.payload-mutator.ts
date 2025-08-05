import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpTaskPayload } from '@requests/tasks/notification-follow-up/follow-up.types';
import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  FollowUpResponseWizardStep,
} from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class FollowUpResponsePayloadMutator extends PayloadMutator {
  subtask = FOLLOW_UP_RESPONSE_SUB_TASK;
  step = FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(
    currentPayload: FollowUpTaskPayload,
    userInput: { response: string; files: UploadedFile[] },
  ): Observable<FollowUpTaskPayload> {
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
