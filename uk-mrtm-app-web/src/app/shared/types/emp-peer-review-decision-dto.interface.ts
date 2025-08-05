import { PeerReviewDecision } from '@mrtm/api';

export interface EmpPeerReviewDecisionDto extends PeerReviewDecision {
  submitter: string;
}
