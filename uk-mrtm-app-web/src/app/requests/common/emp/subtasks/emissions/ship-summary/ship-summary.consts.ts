import { Params } from '@angular/router';

import { EmpShipEmissions } from '@mrtm/api';

import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';

export const EMP_SHIP_SUMMARY_CHANGE_LINKS_MAP: Partial<
  Record<
    keyof Omit<EmpShipEmissions, 'uniqueIdentifier'> & 'emissionSourcesList' & 'fuelsAndEmissionFactorsList',
    { link: string; queryParams: Params }
  >
> = {
  details: {
    link: EmissionsWizardStep.BASIC_DETAILS,
    queryParams: { change: true },
  },
  uncertaintyLevel: {
    link: EmissionsWizardStep.UNCERTAINTY_LEVEL,
    queryParams: { change: true },
  },
  measurements: {
    link: EmissionsWizardStep.MEASUREMENTS,
    queryParams: { change: true },
  },
  carbonCapture: {
    link: EmissionsWizardStep.CARBON_CAPTURE,
    queryParams: { change: true },
  },
  exemptionConditions: {
    link: EmissionsWizardStep.EXEMPTION_CONDITIONS,
    queryParams: { change: true },
  },
  emissionsSources: {
    link: EmissionsWizardStep.EMISSION_SOURCES_FORM,
    queryParams: { change: true },
  },
  fuelsAndEmissionsFactors: {
    link: EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM,
    queryParams: { change: true },
  },
  emissionsSourcesList: {
    link: EmissionsWizardStep.EMISSION_SOURCES_LIST,
    queryParams: { change: true },
  },
  fuelsAndEmissionsFactorsList: {
    link: EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST,
    queryParams: { change: true },
  },
};
