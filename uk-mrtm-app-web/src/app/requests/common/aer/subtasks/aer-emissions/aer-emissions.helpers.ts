import {
  AerDerogations,
  AerFuelsAndEmissionsFactors,
  AerShipDetails,
  AerShipEmissions,
  EmissionsSources,
} from '@mrtm/api';

import { UNCERTAINTY_LEVEL_STEP } from '@requests/common/components/emissions';
import { BASIC_SHIP_DETAILS_STEP } from '@requests/common/components/emissions/basic-ship-details';
import { LIST_OF_SHIPS_DELETE_STEP } from '@requests/common/components/emissions/delete-ships/delete-ships.helper';
import { EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { LIST_OF_SHIPS_STEP, UPLOAD_SHIPS_STEP } from '@requests/common/components/emissions/emissions.helpers';
import { FUELS_AND_EMISSIONS_FORM_STEP } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { EmpFuelsAndEmissionsFactorsExtended } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AllFuelOriginTypeName, FuelsAndEmissionsFactors } from '@shared/types';
import { isLNG, isNil } from '@shared/utils';

export enum AerEmissionsWizardStep {
  LIST_OF_SHIPS = LIST_OF_SHIPS_STEP,
  DELETE_SHIPS = LIST_OF_SHIPS_DELETE_STEP,
  BASIC_DETAILS = BASIC_SHIP_DETAILS_STEP,
  FUELS_AND_EMISSIONS_LIST = FUELS_AND_EMISSIONS_FORM_STEP + '/list',
  FUELS_AND_EMISSIONS_FORM = FUELS_AND_EMISSIONS_FORM_STEP,
  EMISSION_SOURCES_LIST = EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP + '/list',
  EMISSION_SOURCES_FORM = EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP,
  UNCERTAINTY_LEVEL = UNCERTAINTY_LEVEL_STEP,
  DEROGATIONS = 'derogations',
  SHIP_SUMMARY = '../../',
  FETCH_FROM_EMP = 'import-from-emp',
  UPLOAD_SHIPS = UPLOAD_SHIPS_STEP,
  SUMMARY = '../',
}

export const isWizardCompleted = (ships: (AerShipEmissions & { status: TaskItemStatus })[]): boolean => {
  return ships.length && ships.every((ship) => isShipWizardCompleted(ship) && ship.status === TaskItemStatus.COMPLETED);
};

export const aerShipDetailsValidator = (details: AerShipDetails): boolean =>
  !isNil(details?.imoNumber) &&
  !isNil(details?.name) &&
  !isNil(details?.type) &&
  !isNil(details.grossTonnage) &&
  !isNil(details?.flagState) &&
  !isNil(details?.natureOfReportingResponsibility) &&
  !isNil(details?.iceClass) &&
  (details?.allYear || (details?.allYear === false && !isNil(details?.from) && !isNil(details?.to)));

export const aerFuelsAndEmissionsFactorsValidator = (fuelsAndEmissionsFactors: FuelsAndEmissionsFactors[]): boolean =>
  fuelsAndEmissionsFactors?.length > 0 &&
  fuelsAndEmissionsFactors.every((item) => aerFuelsAndEmissionsFactorsItemValidator(item));

const aerFuelsAndEmissionsFactorsItemValidator = (fuelsAndEmissionsFactors: FuelsAndEmissionsFactors): boolean =>
  !isNil(fuelsAndEmissionsFactors?.methane) &&
  !isNil(fuelsAndEmissionsFactors?.carbonDioxide) &&
  !isNil(fuelsAndEmissionsFactors?.nitrousOxide) &&
  !isNil(fuelsAndEmissionsFactors?.origin);

export const aerEmissionsSourcesValidator = (
  emissionsSources: EmissionsSources[],
  fuelsAndEmissionsFactors: AerFuelsAndEmissionsFactors[],
): boolean => {
  const emissionSourceFuelsSet = new Set(
    emissionsSources?.flatMap((source) =>
      source.fuelDetails.map((fuel: AllFuelOriginTypeName) => `${fuel.origin}-${fuel.type}`),
    ),
  );
  const fuelsSet = new Set(
    fuelsAndEmissionsFactors?.flatMap((fuel: EmpFuelsAndEmissionsFactorsExtended) => `${fuel.origin}-${fuel.type}`),
  );
  const allEmissionSourceFuelsIncluded = [...fuelsSet].every((fuel) => emissionSourceFuelsSet.has(fuel));

  return (
    emissionsSources?.length > 0 &&
    emissionsSources.every((item) => emissionsSourcesItemValidator(item)) &&
    allEmissionSourceFuelsIncluded
  );
};

const fuelDetailsValidator = (fuel: AllFuelOriginTypeName) => {
  const isLNGValid = isLNG(fuel) ? !isNil(fuel?.methaneSlip) && !isNil(fuel?.methaneSlipValueType) : true;
  return !isNil(fuel?.uniqueIdentifier) && !isNil(fuel?.origin) && isLNGValid;
};

export const emissionsSourcesItemValidator = (emissionsSources: EmissionsSources): boolean =>
  !isNil(emissionsSources?.name) &&
  !isNil(emissionsSources?.type) &&
  !isNil(emissionsSources?.sourceClass) &&
  emissionsSources?.fuelDetails?.length > 0 &&
  emissionsSources?.fuelDetails?.every((item) => fuelDetailsValidator(item as AllFuelOriginTypeName) === true) &&
  emissionsSources?.monitoringMethod?.length > 0;

export const aerUncertaintyLevelValidator = (ship: AerShipEmissions): boolean => {
  const monitoringMethodSet = (ship?.emissionsSources ?? []).reduce((acc, emissionsSource) => {
    emissionsSource?.monitoringMethod?.forEach((monitoringMethod) => acc.add(monitoringMethod));
    return acc;
  }, new Set<'BDN' | 'BUNKER_TANK' | 'FLOW_METERS' | 'DIRECT'>());

  const uncertaintyLevel = ship?.uncertaintyLevel;
  const uncertaintyLevelItemsValid = uncertaintyLevel?.every(
    (item) =>
      item?.monitoringMethod &&
      (item?.methodApproach === 'DEFAULT' || (item?.methodApproach === 'SHIP_SPECIFIC' && item?.value)),
  );

  return uncertaintyLevel?.length === monitoringMethodSet.size && uncertaintyLevelItemsValid;
};

export const aerDerogationsValidator = (derogations: AerDerogations): boolean =>
  !isNil(derogations?.exceptionFromPerVoyageMonitoring);

export const shipStepsCompletedMap: Record<
  keyof Omit<AerShipEmissions, 'uniqueIdentifier' | 'dataInputType'>,
  (ship: AerShipEmissions) => boolean
> = {
  details: (ship) => aerShipDetailsValidator(ship?.details),
  fuelsAndEmissionsFactors: (ship) => aerFuelsAndEmissionsFactorsValidator(ship?.fuelsAndEmissionsFactors),
  emissionsSources: (ship) => aerEmissionsSourcesValidator(ship?.emissionsSources, ship?.fuelsAndEmissionsFactors),
  uncertaintyLevel: (ship) => aerUncertaintyLevelValidator(ship),
  derogations: (ship) => aerDerogationsValidator(ship?.derogations),
};

export const isShipWizardCompleted = (ship: AerShipEmissions) => {
  for (const key of Object.keys(shipStepsCompletedMap)) {
    if (!shipStepsCompletedMap[key](ship)) {
      return false;
    }
  }
  return true;
};
