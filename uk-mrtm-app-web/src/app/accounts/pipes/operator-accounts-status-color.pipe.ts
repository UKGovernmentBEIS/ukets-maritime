import { Pipe, PipeTransform } from '@angular/core';

import { AccountSearchResultInfoDTO } from '@mrtm/api';

import { TagColor } from '@netz/govuk-components';

@Pipe({
  name: 'operatorAccountsStatusColor',
  standalone: true,
})
export class OperatorAccountsStatusColorPipe implements PipeTransform {
  transform(status: AccountSearchResultInfoDTO['status']): TagColor {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'LIVE':
        return 'green';
      case 'WITHDRAWN':
        return 'red';
      default:
        return 'grey';
    }
  }
}
