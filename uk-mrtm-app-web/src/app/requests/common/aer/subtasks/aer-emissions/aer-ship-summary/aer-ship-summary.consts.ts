import { Params } from '@angular/router';

import { AerShipEmissions } from '@mrtm/api';

import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions';

export const SUMMARY_CHANGE_LINKS_MAP: Partial<
  Record<
    keyof Omit<AerShipEmissions, 'uniqueIdentifier'> & 'emissionSourcesList' & 'fuelsAndEmissionFactorsList',
    {
      link: string;
      queryParams: Params;
    }
  >
> = {
  details: {
    link: AerEmissionsWizardStep.BASIC_DETAILS,
    queryParams: { change: true },
  },
  uncertaintyLevel: {
    link: AerEmissionsWizardStep.UNCERTAINTY_LEVEL,
    queryParams: { change: true },
  },
  emissionsSources: {
    link: AerEmissionsWizardStep.EMISSION_SOURCES_FORM,
    queryParams: { change: true },
  },
  fuelsAndEmissionsFactors: {
    link: AerEmissionsWizardStep.FUELS_AND_EMISSIONS_FORM,
    queryParams: { change: true },
  },
  derogations: {
    link: AerEmissionsWizardStep.DEROGATIONS,
    queryParams: { change: true },
  },
  emissionSourcesList: {
    link: AerEmissionsWizardStep.EMISSION_SOURCES_LIST,
    queryParams: { change: true },
  },
  fuelsAndEmissionFactorsList: {
    link: AerEmissionsWizardStep.FUELS_AND_EMISSIONS_LIST,
    queryParams: { change: true },
  },
};
