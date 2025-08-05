import { InjectionToken } from '@angular/core';

import { AerPort, AerVoyage } from '@mrtm/api';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { AerJourneyTypeEnum } from '@shared/types';

export type AerEmissionsCalculations = Omit<AerPort | AerVoyage, 'portDetails' | 'voyageDetails'> & {
  journeyType?: AerJourneyTypeEnum;
};
export type AerEmissionsCalculationsSelector = (
  id: AerEmissionsCalculations['uniqueIdentifier'],
) => StateSelector<RequestTaskState, AerEmissionsCalculations>;

export const AER_EMISSIONS_CALCULATIONS_SELECTOR: InjectionToken<AerEmissionsCalculationsSelector> =
  new InjectionToken<AerEmissionsCalculations>('' + 'Aer emissions calculations selector');
