import { EmpIssuanceReviewDecision, EmpVariationReviewDecision, ReviewDecisionRequiredChange } from '@mrtm/api';

export interface EmpReviewDecisionDetails {
  notes?: string;
  requiredChanges: Array<ReviewDecisionRequiredChange>;
}

export interface EmpVariationReviewDecisionDetails extends EmpReviewDecisionDetails {
  variationScheduleItems: Array<string>;
}

export interface EmpReviewDecisionUnionBase<TType, TDetails> {
  type: TType;
  details: TDetails;
}

export interface EmpReviewDecisionUnion
  extends EmpReviewDecisionUnionBase<EmpIssuanceReviewDecision['type'], EmpReviewDecisionDetails> {}

export interface EmpVariationReviewDecisionUnion
  extends EmpReviewDecisionUnionBase<EmpVariationReviewDecision['type'], EmpVariationReviewDecisionDetails> {}
