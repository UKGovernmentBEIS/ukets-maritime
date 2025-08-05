import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PeerReviewDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { DoePeerReviewRequestTaskPayload } from '@requests/tasks/doe-peer-review/doe-peer-review.types';

export class DoePeerReviewDecisionPayloadMutator extends PayloadMutator {
  subtask = PEER_REVIEW_DECISION_SUB_TASK;
  step: PeerReviewWizardStep.DECISION;

  override apply(
    currentPayload: DoePeerReviewRequestTaskPayload,
    userInput: PeerReviewDecision,
  ): Observable<DoePeerReviewRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.decision = userInput;
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
