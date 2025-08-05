import { Pipe, PipeTransform } from '@angular/core';

import { EmpIssuanceDetermination, EmpVariationDetermination } from '@mrtm/api';

@Pipe({
  name: 'determinationHeaderType',
  standalone: true,
})
export class DeterminationHeaderTypePipe implements PipeTransform {
  transform(value: EmpIssuanceDetermination['type'] | EmpVariationDetermination['type']): string {
    if (value === 'APPROVED') {
      return 'Emissions monitoring plan approved';
    } else if (value === 'DEEMED_WITHDRAWN') {
      return 'Emissions monitoring plan withdrawn';
    } else if (value === 'REJECTED') {
      return 'Emissions monitoring plan rejected';
    } else {
      return null;
    }
  }
}
