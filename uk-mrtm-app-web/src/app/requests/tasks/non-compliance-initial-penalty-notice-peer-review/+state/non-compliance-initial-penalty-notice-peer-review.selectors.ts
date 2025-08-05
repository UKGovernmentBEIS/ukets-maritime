import { PeerReviewDecision } from '@mrtm/api';

import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/non-compliance-initial-penalty-notice-peer-review.types';

const selectPeerReviewDecision: StateSelector<RequestTaskState, PeerReviewDecision> = createDescendingSelector(
  nonComplianceInitialPenaltyNoticeCommonQuery.selectPayload,
  (payload: NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload) => payload?.decision,
);

export const nonComplianceInitialPenaltyNoticePeerReviewQuery = {
  selectPeerReviewDecision,
};
