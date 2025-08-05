import { Pipe, PipeTransform } from '@angular/core';

import { FollowUpReviewDecisionUnion } from '@shared/types';

@Pipe({
  name: 'followUpReviewDecisionType',
  standalone: true,
})
export class FollowUpReviewDecisionTypePipe implements PipeTransform {
  transform(value: FollowUpReviewDecisionUnion['type'] | undefined): string {
    return value === 'ACCEPTED' ? 'Accepted' : value === 'AMENDS_NEEDED' ? 'Operator amends needed' : null;
  }
}
