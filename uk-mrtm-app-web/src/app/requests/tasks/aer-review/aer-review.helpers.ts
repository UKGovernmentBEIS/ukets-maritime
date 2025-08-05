import { AerDataReviewDecision } from '@mrtm/api';

import { ReviewApplicationFormModel } from '@requests/tasks/aer-review/aer-review.types';

const reviewDecisionDetailsMutationMap: Record<
  AerDataReviewDecision['type'],
  (userInput: ReviewApplicationFormModel) => Partial<AerDataReviewDecision['details']>
> = {
  ACCEPTED: (userInput: ReviewApplicationFormModel) => ({ notes: userInput.notes }),
  OPERATOR_AMENDS_NEEDED: (userInput: ReviewApplicationFormModel) => ({
    notes: userInput?.notes,
    requiredChanges: (userInput.requiredChanges ?? []).map((requiredChange) => ({
      reason: requiredChange.reason,
      files: requiredChange.files.map((file) => file.uuid),
    })),
  }),
};

export const transformDecisionFormModelToDTO = (userInput: ReviewApplicationFormModel): AerDataReviewDecision => ({
  type: userInput?.type,
  reviewDataType: userInput.reviewDataType,
  details: reviewDecisionDetailsMutationMap[userInput.type](userInput),
});
