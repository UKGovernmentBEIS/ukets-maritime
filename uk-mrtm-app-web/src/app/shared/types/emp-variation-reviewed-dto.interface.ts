import { EmpVariationDetermination } from '@mrtm/api';

import { EmpReviewedDto } from '@shared/types';

export interface EmpVariationReviewedDto extends Omit<EmpReviewedDto, 'determination'> {
  determination?: EmpVariationDetermination;
}
