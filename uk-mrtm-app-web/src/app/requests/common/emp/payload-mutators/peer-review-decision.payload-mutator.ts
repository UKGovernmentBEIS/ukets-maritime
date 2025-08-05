import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PeerReviewDecision } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpPeerReviewTaskPayload, EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class PeerReviewDecisionPayloadMutator extends PayloadMutator {
  subtask = PEER_REVIEW_DECISION_SUB_TASK;
  step: PeerReviewWizardStep.DECISION;

  override apply(currentPayload: EmpPeerReviewTaskPayload, userInput: PeerReviewDecision): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.decision = userInput;
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
