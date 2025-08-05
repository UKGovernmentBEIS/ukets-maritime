import { PeerReviewDecision, PeerReviewDecisionSubmittedRequestActionPayload } from '@mrtm/api';

import { createDescendingSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';

const selectPeerReviewer: StateSelector<RequestActionState, string> = createDescendingSelector(
  requestActionQuery.selectAction,
  (action) => action.submitter,
);

const selectDecision: StateSelector<RequestActionState, PeerReviewDecision> = createDescendingSelector(
  timelineCommonQuery.selectPayload<PeerReviewDecisionSubmittedRequestActionPayload>(),
  (payload) => payload?.decision,
);

export const peerReviewDecisionQuery = {
  selectPeerReviewer,
  selectDecision,
};
