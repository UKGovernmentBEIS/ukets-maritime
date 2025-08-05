import { FollowUpResponse, FollowUpReviewDecisionDTO } from '@shared/types';

export interface FollowUpAmends {
  followUpReviewDecision: FollowUpReviewDecisionDTO;
  followUpResponse: FollowUpResponse;
}
