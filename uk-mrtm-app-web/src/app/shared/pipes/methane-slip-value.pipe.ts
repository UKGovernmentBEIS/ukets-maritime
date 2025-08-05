import { Pipe, PipeTransform } from '@angular/core';

import { FuelOriginTypeName } from '@mrtm/api';

@Pipe({
  name: 'methaneSlipValue',
  standalone: true,
})
export class MethaneSlipValuePipe implements PipeTransform {
  transform(
    value: FuelOriginTypeName['methaneSlip'],
    methaneSlipValueType: FuelOriginTypeName['methaneSlipValueType'],
  ): unknown {
    switch (methaneSlipValueType) {
      case 'OTHER':
        return `Other: ${value}`;
      default:
        return value;
    }
  }
}
