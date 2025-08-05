import { AerDataReviewDecision, EmpIssuanceReviewDecision, EmpVariationReviewDecision } from '@mrtm/api';

import { AttachedFile } from '@shared/types/attached-file.interface';

export interface EmpReviewDecisionDtoBase<T> {
  type?: T;
  details?: {
    requiredChanges: {
      reason?: string;
      files?: AttachedFile[];
    }[];
    variationScheduleItems?: Array<string>;
    notes?: string;
  };
}

export interface EmpReviewDecisionDto extends EmpReviewDecisionDtoBase<EmpIssuanceReviewDecision['type']> {}

export interface EmpVariationReviewDecisionDto extends EmpReviewDecisionDtoBase<EmpVariationReviewDecision['type']> {}

export interface AerReviewDecisionDto extends EmpReviewDecisionDtoBase<AerDataReviewDecision['type']> {}
