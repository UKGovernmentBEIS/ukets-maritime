import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { PeerReviewWizardStep } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.providers';
import { isPeerReviewWizardCompleted } from '@requests/common/subtasks/peer-review-decision/peer-review-decision.wizard';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivatePeerReviewDecisionSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const decisionSelector = inject(PEER_REVIEW_DECISION_SELECTOR);
  const decisionStatusSelector = inject(PEER_REVIEW_DECISION_STATUS_SELECTOR);

  const decision = store.select(decisionSelector)(); // TODO: replace this in all used places empPeerReviewQuery.selectDecision)();
  const stepCompleted = isPeerReviewWizardCompleted(decision);
  const status = store.select(decisionStatusSelector)(); // TODO: replace this in all used places empPeerReviewQuery.selectPeerReviewStatus(PEER_REVIEW_DECISION_SUB_TASK))();

  if (!stepCompleted || status === TaskItemStatus.NOT_STARTED) {
    return createUrlTreeFromSnapshot(route, [PeerReviewWizardStep.DECISION]);
  }

  return status !== TaskItemStatus.COMPLETED || createUrlTreeFromSnapshot(route, [PeerReviewWizardStep.SUCCESS]);
};
