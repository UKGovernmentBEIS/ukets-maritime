import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { SubTaskListMap } from '@shared/types';

export const variationReviewDetailsSubtaskMap: SubTaskListMap<
  Pick<EmpVariationReviewTaskPayload, 'empVariationDetails'>
> = {
  title: 'Variation details',
  empVariationDetails: {
    title: 'Review the changes',
  },
};
