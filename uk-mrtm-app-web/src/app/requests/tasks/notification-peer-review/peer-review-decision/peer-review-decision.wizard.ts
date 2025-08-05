import { PeerReviewDecisionState } from '@requests/tasks/notification-peer-review/+state/peer-review.state';

function hasReachedDecision(accepted: boolean) {
  return accepted !== null && accepted !== undefined;
}

export const isWizardCompleted = (peerReviewDecision: PeerReviewDecisionState) => {
  return hasReachedDecision(peerReviewDecision.accepted) && !!peerReviewDecision?.notes;
};
