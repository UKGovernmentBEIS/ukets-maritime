import { PeerReviewDecision } from '@mrtm/api';

import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { doeCommonQuery } from '@requests/common/doe';
import { DoePeerReviewRequestTaskPayload } from '@requests/tasks/doe-peer-review/doe-peer-review.types';

const selectPeerReviewDecision: StateSelector<RequestTaskState, PeerReviewDecision> = createDescendingSelector(
  doeCommonQuery.selectPayload,
  (payload: DoePeerReviewRequestTaskPayload) => payload?.decision,
);

export const doePeerReviewQuery = {
  selectPeerReviewDecision,
};
