import { FormArray, FormControl } from '@angular/forms';

import {
  AerShipEmissions,
  EmissionsSources,
  EmpEmissionsSources,
  EmpShipEmissions,
  FuelOriginTypeName,
} from '@mrtm/api';

export type FuelDetailsFormGroupModel = Record<
  keyof Pick<FuelOriginTypeName, 'uniqueIdentifier' | 'methaneSlip'> & 'methaneSlipOther',
  FormControl
>;

export type EmissionSourcesAndFuelTypesUsedFormType = Omit<EmissionsSources, 'fuelDetails'> & {
  shipId: (AerShipEmissions | EmpShipEmissions)['uniqueIdentifier'];
  fuelDetails: [
    {
      uniqueIdentifier: FuelOriginTypeName['uniqueIdentifier'];
      methaneSlip?: FuelOriginTypeName['methaneSlip'] | FuelOriginTypeName['methaneSlipValueType'];
      methaneSlipOther?: string;
    },
  ];
};

export type EmissionSourcesAndFuelTypesUsedFormModel = Record<
  keyof Omit<EmissionSourcesAndFuelTypesUsedFormType, 'fuelDetails'>,
  FormControl
> & { fuelDetails: FormArray };

export type EmpEmissionSourcesAndFuelTypesUsedFormType = EmissionSourcesAndFuelTypesUsedFormType &
  Pick<EmpEmissionsSources, 'referenceNumber'>;

export type EmpEmissionSourcesAndFuelTypesUsedFormModel = Record<
  keyof Omit<EmpEmissionSourcesAndFuelTypesUsedFormType, 'fuelDetails'>,
  FormControl
> & { fuelDetails: FormArray };
