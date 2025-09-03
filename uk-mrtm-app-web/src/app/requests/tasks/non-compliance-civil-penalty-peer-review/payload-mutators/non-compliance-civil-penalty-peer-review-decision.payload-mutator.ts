import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PeerReviewDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NonComplianceCivilPenaltyPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-civil-penalty-peer-review/non-compliance-civil-penalty-peer-review.types';

export class NonComplianceCivilPenaltyPeerReviewDecisionPayloadMutator extends PayloadMutator {
  subtask = PEER_REVIEW_DECISION_SUB_TASK;
  step: PeerReviewWizardStep.DECISION;

  override apply(
    currentPayload: NonComplianceCivilPenaltyPeerReviewRequestTaskPayload,
    userInput: PeerReviewDecision,
  ): Observable<NonComplianceCivilPenaltyPeerReviewRequestTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.decision = userInput;
        payload.sectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
