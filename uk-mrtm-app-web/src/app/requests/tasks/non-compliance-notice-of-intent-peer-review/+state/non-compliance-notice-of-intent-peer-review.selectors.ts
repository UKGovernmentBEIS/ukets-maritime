import { PeerReviewDecision } from '@mrtm/api';

import { createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/non-compliance-notice-of-intent-peer-review.types';

const selectPeerReviewDecision: StateSelector<RequestTaskState, PeerReviewDecision> = createDescendingSelector(
  nonComplianceNoticeOfIntentCommonQuery.selectPayload,
  (payload: NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload) => payload?.decision,
);

export const nonComplianceNoticeOfIntentPeerReviewQuery = {
  selectPeerReviewDecision,
};
