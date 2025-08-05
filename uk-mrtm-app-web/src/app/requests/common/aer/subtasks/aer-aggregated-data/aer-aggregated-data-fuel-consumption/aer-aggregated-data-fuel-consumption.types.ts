import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AerAggregatedDataFuelConsumption, AerShipAggregatedData, FuelOriginTypeName } from '@mrtm/api';

export type AerAggregatedDataFuelConsumptionItemFormModel = Pick<
  AerAggregatedDataFuelConsumption,
  'totalConsumption'
> & {
  fuelOriginTypeName: FuelOriginTypeName['uniqueIdentifier'];
};

export type AerAggregatedDataFuelConsumptionFormModel = Pick<AerShipAggregatedData, 'uniqueIdentifier'> & {
  fuelConsumptions: Array<AerAggregatedDataFuelConsumptionItemFormModel>;
};

export type AerAggregatedDataFuelConsumptionItemFormGroupModel = Record<
  keyof AerAggregatedDataFuelConsumptionItemFormModel,
  FormControl
>;

export type AerAggregatedDataFuelConsumptionFormGroupModel = {
  uniqueIdentifier: FormControl;
  fuelConsumptions: FormArray<FormGroup<AerAggregatedDataFuelConsumptionItemFormGroupModel>>;
};
