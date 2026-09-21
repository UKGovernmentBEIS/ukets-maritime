import { Pipe, PipeTransform } from '@angular/core';

import { ThirdPartyDataManagementImportRequestDTO } from '@mrtm/api';

@Pipe({
  name: 'apiDataManagementTaskTypeToText',
})
export class ApiDataManagementTaskTypeToTextPipe implements PipeTransform {
  transform(value: ThirdPartyDataManagementImportRequestDTO['requestType'], year?: number): string {
    switch (value) {
      case 'AER':
        return year ? `Complete ${year} emissions report` : 'Complete annual emissions report';
      case 'EMP_ISSUANCE':
        return 'Apply for an emissions monitoring plan';
      case 'EMP_VARIATION':
        return 'Apply to vary the emissions monitoring plan';
      default:
        return value;
    }
  }
}
