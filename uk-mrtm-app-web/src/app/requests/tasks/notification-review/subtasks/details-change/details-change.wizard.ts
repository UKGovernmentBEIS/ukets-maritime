import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationReviewDecisionUnion } from '@shared/types';

export const isWizardCompleted = (reviewDecision?: NotificationReviewDecisionUnion) => {
  const followUp = reviewDecision?.details?.followUp;
  const reviewRejectedComplete =
    reviewDecision?.type === TaskItemStatus.REJECTED && !!reviewDecision.details?.officialNotice;
  const followUpComplete =
    followUp?.followUpResponseRequired === false ||
    (followUp?.followUpResponseRequired === true &&
      !!followUp?.followUpRequest &&
      !!followUp?.followUpResponseExpirationDate);
  const reviewAcceptedComplete =
    reviewDecision?.type === TaskItemStatus.ACCEPTED && !!reviewDecision.details?.officialNotice && followUpComplete;

  return reviewRejectedComplete || reviewAcceptedComplete;
};
