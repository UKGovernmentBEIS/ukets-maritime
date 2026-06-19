import { Pipe, PipeTransform } from '@angular/core';

import { TagColor } from '@netz/govuk-components';

import { MrtmRequestStatus } from '@shared/types';

@Pipe({
  name: 'requestStatusTagColor',
  standalone: true,
})
export class RequestStatusTagColorPipe implements PipeTransform {
  transform(status: MrtmRequestStatus): TagColor {
    switch (status) {
      case 'CANCELLED':
      case 'CLOSED':
        return 'grey';

      case 'COMPLETED':
      case 'APPROVED':
        return 'green';

      case 'IN_PROGRESS':
        return 'blue';

      case 'WITHDRAWN':
      case 'REJECTED':
      case 'EXEMPT':
        return 'red';

      case 'MIGRATED':
        return 'yellow';

      default:
        return null;
    }
  }
}
