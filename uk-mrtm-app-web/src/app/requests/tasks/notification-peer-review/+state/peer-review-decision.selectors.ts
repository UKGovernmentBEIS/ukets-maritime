import { createSelector, StateSelector } from '@netz/common/store';

import { PeerReviewDecisionState, PeerReviewState } from '@requests/tasks/notification-peer-review/+state';

export const selectDecision: StateSelector<PeerReviewState, PeerReviewDecisionState> = createSelector(
  (state) => state.decision,
);

export const selectIsDecisionSubmitted: StateSelector<PeerReviewState, boolean> = createSelector(
  (state) => state.decision.isSubmitted,
);

export const peerReviewDecisionQuery = {
  selectDecision,
  selectIsDecisionSubmitted,
};
