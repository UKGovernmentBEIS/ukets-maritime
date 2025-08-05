import { Pipe, PipeTransform } from '@angular/core';

import { ShipDetails } from '@mrtm/api';

import { SHIP_TYPE_SELECT_ITEMS } from '@shared/constants';

@Pipe({
  name: 'shipType',
  standalone: true,
})
export class ShipTypePipe implements PipeTransform {
  transform(value: ShipDetails['type']): string {
    const type = SHIP_TYPE_SELECT_ITEMS.find((x) => x.value === value);
    return type ? type.text : value;
  }
}
