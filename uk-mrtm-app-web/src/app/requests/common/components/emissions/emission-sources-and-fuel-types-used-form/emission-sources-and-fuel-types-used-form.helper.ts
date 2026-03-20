import { FuelOriginTypeName } from '@mrtm/api';

import { isNil } from '@shared/utils';

export const EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP = 'emission-sources-and-fuel-types';

export const getMethaneSlipFromUserInput = (
  methaneSlip?: FuelOriginTypeName['methaneSlip'] | FuelOriginTypeName['methaneSlipValueType'],
  methaneSlipOther?: string,
): {
  methaneSlipValue: FuelOriginTypeName['methaneSlip'] | null;
  methaneSlipValueType: FuelOriginTypeName['methaneSlipValueType'] | null;
} => {
  return {
    methaneSlipValue: isNil(methaneSlip) ? null : methaneSlip === 'OTHER' ? methaneSlipOther : methaneSlip,
    methaneSlipValueType: isNil(methaneSlip) ? null : (methaneSlip as string) === 'OTHER' ? 'OTHER' : 'PRESELECTED',
  };
};
