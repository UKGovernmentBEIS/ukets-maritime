import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpNotificationReviewDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-review/subtasks/details-change';

export class DetailsChangeDecisionPayloadMutator extends PayloadMutator {
  subtask = DETAILS_CHANGE_SUB_TASK;
  step = DetailsChangeWizardStep.REVIEW_DECISION;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: ReviewTaskPayload, userInput: EmpNotificationReviewDecision): Observable<ReviewTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reviewDecision = userInput;
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
