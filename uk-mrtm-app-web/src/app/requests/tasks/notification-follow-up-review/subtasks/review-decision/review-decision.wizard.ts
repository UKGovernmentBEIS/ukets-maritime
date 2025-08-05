import { FollowUpReviewDecisionUnion } from '@shared/types';

export const isWizardCompleted = (reviewDecision?: FollowUpReviewDecisionUnion) => {
  return (
    reviewDecision?.type === 'ACCEPTED' ||
    (reviewDecision?.type === 'AMENDS_NEEDED' && reviewDecision?.details?.requiredChanges?.length > 0)
  );
};
