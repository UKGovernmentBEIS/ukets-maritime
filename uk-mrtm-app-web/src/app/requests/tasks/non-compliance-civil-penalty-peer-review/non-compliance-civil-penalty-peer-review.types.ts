import { NonComplianceCivilPenaltyRequestTaskPayload, PeerReviewDecision } from '@mrtm/api';

export type NonComplianceCivilPenaltyPeerReviewRequestTaskPayload = NonComplianceCivilPenaltyRequestTaskPayload & {
  decision: PeerReviewDecision;
};
