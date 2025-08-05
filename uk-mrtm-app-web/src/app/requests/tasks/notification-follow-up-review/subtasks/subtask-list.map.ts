import { SubTaskListMap } from '@shared/types';

export const followUpReviewDecisionMap: SubTaskListMap<{ reviewDecisionQuestion: string }> = {
  title: 'Operator follow-up response',
  reviewDecisionQuestion: {
    title: 'Review follow-up response',
  },
};
