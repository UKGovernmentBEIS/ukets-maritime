import { Pipe, PipeTransform } from '@angular/core';

import { EmpVariationDetermination } from '@mrtm/api';

@Pipe({
  name: 'variationDeterminationHeaderType',
  standalone: true,
})
export class VariationDeterminationHeaderTypePipe implements PipeTransform {
  transform(value: EmpVariationDetermination['type']): string {
    if (value === 'APPROVED') {
      return 'Provide a reason for your decision (optional)';
    } else if (value === 'DEEMED_WITHDRAWN') {
      return 'Provide a reason for withdrawing the application';
    } else if (value === 'REJECTED') {
      return 'Provide a reason to support the rejection decision';
    } else {
      return null;
    }
  }
}
