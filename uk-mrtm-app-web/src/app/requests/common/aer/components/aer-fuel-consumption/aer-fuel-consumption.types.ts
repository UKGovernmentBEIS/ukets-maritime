import { InjectionToken } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AerFuelConsumption, AerPort, AerVoyage } from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

export type AerFuelConsumptionFormModel = Omit<AerFuelConsumption, 'fuelOriginTypeName' | 'methaneSlipValueType'> & {
  objectId: string;
  fuelOrigin: string;
  methaneSlip?: string;
};

export type AerFuelConsumptionFormGroupModel = Record<keyof AerFuelConsumptionFormModel, FormControl>;
export type FuelConsumptionSelector = (
  objectId: (AerPort | AerVoyage)['uniqueIdentifier'],
  fuelConsumptionId: AerFuelConsumption['uniqueIdentifier'],
) => StateSelector<RequestTaskState, AerFuelConsumption>;

export const AER_FUEL_CONSUMPTION_SELECTOR: InjectionToken<FuelConsumptionSelector> =
  new InjectionToken<FuelConsumptionSelector>('Aer fuel consumption selector');
