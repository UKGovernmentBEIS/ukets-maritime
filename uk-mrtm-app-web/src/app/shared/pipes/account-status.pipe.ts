import { Pipe, PipeTransform } from '@angular/core';

import { MrtmAccountStatus } from '@mrtm/api';

@Pipe({ name: 'accountStatus', standalone: true })
export class AccountStatusPipe implements PipeTransform {
  transform(status?: MrtmAccountStatus): string {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'LIVE':
        return 'Live';
      case 'CLOSED':
        return 'Closed';
      case 'WITHDRAWN':
        return 'Withdrawn';
      default:
        return null;
    }
  }
}
