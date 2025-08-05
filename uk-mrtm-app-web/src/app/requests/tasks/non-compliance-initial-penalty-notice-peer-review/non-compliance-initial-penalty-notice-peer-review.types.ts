import { NonComplianceInitialPenaltyNoticeRequestTaskPayload, PeerReviewDecision } from '@mrtm/api';

export type NonComplianceInitialPenaltyNoticePeerReviewRequestTaskPayload =
  NonComplianceInitialPenaltyNoticeRequestTaskPayload & {
    decision: PeerReviewDecision;
  };
