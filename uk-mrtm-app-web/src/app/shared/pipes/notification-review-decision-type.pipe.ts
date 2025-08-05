import { Pipe, PipeTransform } from '@angular/core';

import { NotificationReviewDecisionUnion } from '@shared/types';

@Pipe({
  name: 'notificationReviewDecisionType',
  standalone: true,
})
export class NotificationReviewDecisionTypePipe implements PipeTransform {
  transform(value: NotificationReviewDecisionUnion['type'] | undefined): string {
    return value === 'ACCEPTED' ? 'Accepted' : value === 'REJECTED' ? 'Rejected' : null;
  }
}
