import { Pipe, PipeTransform } from '@angular/core';

import { FUEL_ORIGIN_TITLE } from '@shared/constants';
import { FuelsAndEmissionsFactors } from '@shared/types';

@Pipe({
  name: 'shipFuelOrigin',
  standalone: true,
})
export class ShipFuelOriginPipe implements PipeTransform {
  transform(value: FuelsAndEmissionsFactors['origin']): string {
    return FUEL_ORIGIN_TITLE[value] ?? value;
  }
}
