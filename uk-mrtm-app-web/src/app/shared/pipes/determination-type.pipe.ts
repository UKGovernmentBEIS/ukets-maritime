import { Pipe, PipeTransform } from '@angular/core';

import { EmpIssuanceDetermination, EmpVariationDetermination } from '@mrtm/api';

@Pipe({
  name: 'determinationType',
  standalone: true,
})
export class DeterminationTypePipe implements PipeTransform {
  transform(value: EmpIssuanceDetermination['type'] | EmpVariationDetermination['type']): string {
    if (value === 'APPROVED') {
      return 'Approve';
    } else if (value === 'DEEMED_WITHDRAWN') {
      return 'Withdraw';
    } else if (value === 'REJECTED') {
      return 'Rejected';
    } else {
      return null;
    }
  }
}
