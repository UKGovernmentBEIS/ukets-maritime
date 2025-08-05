import { FormControl, FormGroup } from '@angular/forms';

import { AerShipAggregatedData } from '@mrtm/api';

export type AerAggregatedDataAnnualEmissionsFormModel = Pick<
  AerShipAggregatedData,
  'totalAggregatedEmissions' | 'emissionsBetweenUKAndEEAVoyages' | 'emissionsBetweenUKPorts' | 'emissionsWithinUKPorts'
>;

export type AerAggregatedDataAnnualEmissionsFormGroupModel = Record<
  keyof AerAggregatedDataAnnualEmissionsFormModel,
  FormGroup
> &
  Record<keyof Pick<AerShipAggregatedData, 'uniqueIdentifier'>, FormControl>;
