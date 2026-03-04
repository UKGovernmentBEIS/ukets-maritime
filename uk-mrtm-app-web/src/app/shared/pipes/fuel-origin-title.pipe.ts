import { Pipe, PipeTransform } from '@angular/core';

import { AerAggregatedDataFuelOriginTypeName, FuelOriginTypeName } from '@mrtm/api';

import { FUEL_ORIGIN_TITLE, FUEL_TYPES_BY_ORIGIN } from '@shared/constants';
import { FossilFuels, FuelsAndEmissionsFactors } from '@shared/types';
import { isNil } from '@shared/utils';

@Pipe({
  name: 'fuelOriginTitle',
  standalone: true,
})
export class FuelOriginTitlePipe implements PipeTransform {
  transform(
    value: FuelsAndEmissionsFactors | FuelOriginTypeName | AerAggregatedDataFuelOriginTypeName,
    showMethaneSlip = true,
  ): string {
    const fuelOriginTypeName = value as FuelOriginTypeName;
    const methaneSlipFragment = !isNil(fuelOriginTypeName?.methaneSlip)
      ? fuelOriginTypeName?.methaneSlipValueType === 'OTHER'
        ? `\n<strong>Methane slip:</strong> Other: ${fuelOriginTypeName?.methaneSlip}`
        : `\n<strong>Methane slip:</strong> ${fuelOriginTypeName?.methaneSlip}`
      : null;

    const { origin, type, name } = value as FossilFuels;

    const fuelFragment = [
      FUEL_ORIGIN_TITLE[origin],
      FUEL_TYPES_BY_ORIGIN[origin].find((x) => x.value === type)?.text,
      name,
    ]
      .filter(Boolean)
      .join(' / ');

    return methaneSlipFragment && showMethaneSlip ? fuelFragment + methaneSlipFragment : fuelFragment;
  }
}
