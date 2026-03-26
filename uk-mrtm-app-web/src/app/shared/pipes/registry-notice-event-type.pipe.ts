import { Pipe, PipeTransform } from '@angular/core';

import { RegistryRegulatorNoticeEventSubmittedRequestActionPayload } from '@mrtm/api';

@Pipe({
  name: 'registryNoticeEventType',
})
export class RegistryNoticeEventTypePipe implements PipeTransform {
  transform(value: RegistryRegulatorNoticeEventSubmittedRequestActionPayload['type']): string {
    switch (value) {
      case 'EMP_WITHDRAWN':
        return 'EMP withdrawn';
      case 'ACCOUNT_CLOSED':
        return 'Account closed';
    }
  }
}
