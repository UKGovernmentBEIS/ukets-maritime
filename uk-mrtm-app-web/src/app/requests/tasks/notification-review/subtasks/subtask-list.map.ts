import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { SubTaskListMap } from '@shared/types';

export const detailsChangeMap: SubTaskListMap<ReviewTaskPayload> = {
  title: 'Details of the change',
  reviewDecision: {
    title: 'Review the details of the change',
  },
};
