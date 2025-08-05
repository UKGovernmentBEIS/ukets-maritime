import { AttachedFile } from '@shared/types/attached-file.interface';
import { NotificationReviewDecisionUnion } from '@shared/types/notification-review-decision-union.interface';
import { NotifyAccountOperatorUsersInfo } from '@shared/types/notify-account-operator-users-info.type';

export interface NotificationCompleted {
  request: string;
  response: string;
  dueDate: string;
  submissionDate: string;
  decisionType: NotificationReviewDecisionUnion['type'];
  usersInfo: NotifyAccountOperatorUsersInfo;
  signatory: string;
  attachments: AttachedFile[];
}
