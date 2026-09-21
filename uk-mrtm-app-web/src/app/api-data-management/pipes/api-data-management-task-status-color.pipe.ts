import { Pipe, PipeTransform } from '@angular/core';

import { ThirdPartyDataManagementTransactionItem } from '@mrtm/api';

import { TagColor } from '@netz/govuk-components';

@Pipe({
  name: 'apiDataManagementTaskStatusColor',
})
export class ApiDataManagementTaskStatusColorPipe implements PipeTransform {
  transform(value: ThirdPartyDataManagementTransactionItem['status']): TagColor | null {
    switch (value) {
      case 'COMPLETED':
        return null;
      case 'COMPLETED_WITH_FAILURES':
        return 'orange';
      case 'IN_PROGRESS':
        return 'yellow';
      case 'FAILED':
      default:
        return 'red';
    }
  }
}
