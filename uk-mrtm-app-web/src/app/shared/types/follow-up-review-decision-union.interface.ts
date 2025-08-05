import { EmpNotificationFollowupRequiredChangesDecisionDetails, ReviewDecisionDetails } from '@mrtm/api';

export interface FollowUpReviewDecisionUnion {
  type: 'ACCEPTED' | 'AMENDS_NEEDED';
  details?: ReviewDecisionDetails & EmpNotificationFollowupRequiredChangesDecisionDetails;
}
