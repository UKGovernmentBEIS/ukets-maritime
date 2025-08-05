import { Pipe, PipeTransform } from '@angular/core';

import { AerEtsComplianceRules } from '@mrtm/api';

@Pipe({ name: 'nonConformitiesToText', standalone: true, pure: true })
export class NonConformitiesToTextPipe implements PipeTransform {
  transform(value: AerEtsComplianceRules['nonConformities']): string {
    switch (value) {
      case 'YES':
        return 'Yes';
      case 'NO':
        return 'No';
      case 'NOT_APPLICABLE':
        return 'Not applicable';
      default:
        return null;
    }
  }
}
