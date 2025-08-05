import { InjectionToken } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AerPort, AerPortEmissionsMeasurement, AerVoyage } from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

export type AerDirectEmissionsFormModel = AerPortEmissionsMeasurement & Pick<AerPort | AerVoyage, 'uniqueIdentifier'>;
export type AerDirectEmissionsFormGroupModel = Record<keyof AerDirectEmissionsFormModel, FormControl>;
export type DirectEmissionsSelector = (
  id: (AerPort | AerVoyage)['uniqueIdentifier'],
) => StateSelector<RequestTaskState, AerPortEmissionsMeasurement>;

export const AER_DIRECT_EMISSIONS_SELECTOR: InjectionToken<DirectEmissionsSelector> =
  new InjectionToken<DirectEmissionsSelector>('Aer direct emissions selector');
