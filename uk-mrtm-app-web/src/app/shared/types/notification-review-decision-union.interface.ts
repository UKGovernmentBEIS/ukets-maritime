import { EmpNotificationAcceptedDecisionDetails, ReviewDecisionDetails } from '@mrtm/api';

export interface NotificationReviewDecisionUnion {
  type: 'ACCEPTED' | 'REJECTED';
  details?: ReviewDecisionDetails & EmpNotificationAcceptedDecisionDetails;
}
