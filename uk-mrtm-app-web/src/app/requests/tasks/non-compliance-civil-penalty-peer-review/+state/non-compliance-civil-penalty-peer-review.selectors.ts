import { PeerReviewDecision } from '@mrtm/api';

import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { NonComplianceCivilPenaltyPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-civil-penalty-peer-review/non-compliance-civil-penalty-peer-review.types';

const selectPeerReviewDecision: StateSelector<RequestTaskState, PeerReviewDecision> = createDescendingSelector(
  nonComplianceCivilPenaltyCommonQuery.selectPayload,
  (payload: NonComplianceCivilPenaltyPeerReviewRequestTaskPayload) => payload?.decision,
);

export const nonComplianceCivilPenaltyPeerReviewQuery = {
  selectPeerReviewDecision,
};
