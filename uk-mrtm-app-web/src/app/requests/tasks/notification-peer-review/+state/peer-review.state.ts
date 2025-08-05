export interface PeerReviewDecisionState {
  accepted: boolean;
  notes: string;
  isSubmitted: boolean;
}

export interface PeerReviewState {
  decision: PeerReviewDecisionState;
}

export const initialPeerReviewDecisionState: PeerReviewDecisionState = {
  accepted: null,
  notes: null,
  isSubmitted: null,
};

export const initialPeerReviewState: PeerReviewState = {
  decision: initialPeerReviewDecisionState,
};
