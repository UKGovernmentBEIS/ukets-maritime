import { Pipe, PipeTransform } from '@angular/core';

import { EmpReviewDecisionUnion, EmpVariationReviewDecisionUnion } from '@shared/types';

@Pipe({
  name: 'empReviewDecisionType',
  standalone: true,
})
export class EmpReviewDecisionTypePipe implements PipeTransform {
  transform(value: EmpReviewDecisionUnion['type'] | EmpVariationReviewDecisionUnion['type'] | undefined): string {
    const decisionMap: Record<EmpReviewDecisionUnion['type'] | EmpVariationReviewDecisionUnion['type'], string> = {
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      OPERATOR_AMENDS_NEEDED: 'Operator amends needed',
    };

    return decisionMap[value] ?? null;
  }
}
