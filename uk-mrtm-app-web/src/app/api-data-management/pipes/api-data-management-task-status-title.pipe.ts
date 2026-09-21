import { Pipe, PipeTransform } from '@angular/core';

import { ThirdPartyDataManagementTransactionItem } from '@mrtm/api';

@Pipe({
  name: 'apiDataManagementTaskStatusTitle',
})
export class ApiDataManagementTaskStatusTitlePipe implements PipeTransform {
  transform(value: ThirdPartyDataManagementTransactionItem['status']): string {
    switch (value) {
      case 'COMPLETED':
        return 'Completed';
      case 'COMPLETED_WITH_FAILURES':
        return 'Completed with failures';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'FAILED':
      default:
        return 'Failed';
    }
  }
}
