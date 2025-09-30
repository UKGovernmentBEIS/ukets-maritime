import { AerFuelsAndEmissionsFactors, EmissionsSources, EmpFuelsAndEmissionsFactors } from '@mrtm/api';

export const findNotAssociatedFuelFactors = (
  emissionSources: Array<EmissionsSources>,
  fuelFactors: Array<AerFuelsAndEmissionsFactors | EmpFuelsAndEmissionsFactors>,
): Array<AerFuelsAndEmissionsFactors | EmpFuelsAndEmissionsFactors> => {
  const emissionsFuels = emissionSources
    .map((source) => source.fuelDetails.map((fuelDetail) => fuelDetail.uniqueIdentifier))
    .flat();

  return fuelFactors.filter((fuelFactor) => !emissionsFuels.includes(fuelFactor.uniqueIdentifier));
};
