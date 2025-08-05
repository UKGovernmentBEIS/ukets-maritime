import { DoeApplicationSubmitRequestTaskPayload, PeerReviewDecision } from '@mrtm/api';

export type DoePeerReviewRequestTaskPayload = DoeApplicationSubmitRequestTaskPayload & { decision: PeerReviewDecision };
