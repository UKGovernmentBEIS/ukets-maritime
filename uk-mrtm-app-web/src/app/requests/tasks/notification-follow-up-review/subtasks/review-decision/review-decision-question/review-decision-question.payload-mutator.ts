import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationFollowUpReviewDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import {
  REVIEW_DECISION_SUB_TASK,
  ReviewDecisionWizardStep,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';
import { UploadedFile } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

interface UserInputFollowUpReviewDecision {
  type: EmpNotificationFollowUpReviewDecision['type'];
  notes?: string;
  requiredChanges?: [
    {
      reason: string;
      files?: UploadedFile[];
    },
  ];
  dueDate?: string;
}

export class ReviewDecisionQuestionPayloadMutator extends PayloadMutator {
  subtask = REVIEW_DECISION_SUB_TASK;
  step = ReviewDecisionWizardStep.REVIEW_DECISION_QUESTION;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(
    currentPayload: FollowUpReviewTaskPayload,
    userInput: UserInputFollowUpReviewDecision,
  ): Observable<FollowUpReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reviewDecision = {
          type: userInput.type,
          details: {
            notes: userInput.notes,
            ...(userInput.type === 'AMENDS_NEEDED'
              ? {
                  requiredChanges: userInput.requiredChanges.map((requiredChange) => ({
                    reason: requiredChange.reason,
                    files: requiredChange.files.map((file) => file.uuid),
                  })),
                  dueDate: userInput.dueDate,
                }
              : null),
          },
        };

        const totalFiles = userInput?.requiredChanges?.map((change) => change?.files).flat();
        payload.followUpAttachments = {
          ...payload.followUpAttachments,
          ...transformToTaskAttachments(totalFiles),
        };
        payload.sectionsCompleted[this.subtask] = userInput.type;
      }),
    );
  }
}
