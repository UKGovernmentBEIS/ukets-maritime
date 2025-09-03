import { Pipe, PipeTransform } from '@angular/core';

import { EmpVariationReviewDecision } from '@mrtm/api';

import { ReviewDecisionType } from '@shared/types';

@Pipe({
  name: 'reviewDecisionType',
  standalone: true,
})
export class ReviewDecisionTypePipe implements PipeTransform {
  transform(value: ReviewDecisionType | EmpVariationReviewDecision['type'] | undefined): string {
    const decisionMap: Record<ReviewDecisionType | EmpVariationReviewDecision['type'], string> = {
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      OPERATOR_AMENDS_NEEDED: 'Operator amends needed',
    };

    return decisionMap[value] ?? null;
  }
}
