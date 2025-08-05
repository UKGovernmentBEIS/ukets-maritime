import { FuelOriginTypeName } from '@mrtm/api';

import { FUEL_ORIGIN_TITLE, FUEL_TYPES_BY_ORIGIN } from '@shared/constants';
import { FuelOriginTitlePipe } from '@shared/pipes/fuel-origin-title.pipe';
import { FossilFuels } from '@shared/types';

describe('FuelOriginTitlePipe', () => {
  it('create an instance', () => {
    const pipe = new FuelOriginTitlePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct string with all fields', () => {
    const pipe = new FuelOriginTitlePipe();

    let data: Partial<FossilFuels> = {
      origin: 'FOSSIL',
      type: 'H2',
    };

    expect(pipe.transform(data as FossilFuels)).toEqual(
      `${FUEL_ORIGIN_TITLE[data.origin]} / ${FUEL_TYPES_BY_ORIGIN[data.origin].find((item) => item.value === data.type)?.text}`,
    );

    data = {
      origin: 'FOSSIL',
      type: 'OTHER',
      name: 'test',
    };

    expect(pipe.transform(data as FossilFuels)).toEqual(
      `${FUEL_ORIGIN_TITLE[data.origin]} / ${FUEL_TYPES_BY_ORIGIN[data.origin].find((item) => item.value === data.type)?.text} / ${data.name}`,
    );
  });

  it('should return correct string when type is FuelOriginTypeName and methaneSlipValueType is "OTHER"', () => {
    const pipe = new FuelOriginTitlePipe();

    const data: FuelOriginTypeName = {
      origin: 'FOSSIL',
      uniqueIdentifier: 'e79a5037-e38d-4dcf-a037-af6b532b15c3',
      methaneSlip: '1',
      methaneSlipValueType: 'OTHER',
      type: 'LNG',
    } as FuelOriginTypeName;

    expect(pipe.transform(data as FossilFuels)).toEqual(
      'Fossil fuel / Liquified Natural Gas (LNG)\n<strong>Methane slip:</strong> Other: 1',
    );
  });

  it('should return correct string when type is FuelOriginTypeName and methaneSlipValueType is "PRESELECTED"', () => {
    const pipe = new FuelOriginTitlePipe();

    const data: FuelOriginTypeName = {
      origin: 'FOSSIL',
      uniqueIdentifier: 'e79a5037-e38d-4dcf-a037-af6b532b15c3',
      methaneSlip: '1',
      methaneSlipValueType: 'PRESELECTED',
      type: 'LNG',
    } as FuelOriginTypeName;

    expect(pipe.transform(data as FossilFuels)).toEqual(
      'Fossil fuel / Liquified Natural Gas (LNG)\n<strong>Methane slip:</strong> 1',
    );
  });
});
