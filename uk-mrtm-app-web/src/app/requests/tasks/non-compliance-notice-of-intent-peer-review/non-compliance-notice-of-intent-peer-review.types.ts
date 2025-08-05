import { NonComplianceNoticeOfIntentRequestTaskPayload, PeerReviewDecision } from '@mrtm/api';

export type NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload = NonComplianceNoticeOfIntentRequestTaskPayload & {
  decision: PeerReviewDecision;
};
