import {
  EmpCarbonCapture,
  EmpEmissionsSources,
  EmpFuelsAndEmissionsFactors,
  EmpShipEmissions,
  ExemptionConditions,
  MeasurementDescription,
  ShipDetails,
} from '@mrtm/api';

import { EmpFuelsAndEmissionsFactorsExtended } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import { AllFuelOriginTypeName } from '@shared/types';
import { isLNG, isNil } from '@shared/utils';

type shipEmissionKeys = keyof Omit<EmpShipEmissions, 'uniqueIdentifier'>;

export const shipDetailsValidator = (details: ShipDetails): boolean =>
  !isNil(details?.type) &&
  !isNil(details?.iceClass) &&
  !isNil(details?.name) &&
  !isNil(details?.flagState) &&
  !isNil(details.grossTonnage) &&
  !isNil(details?.natureOfReportingResponsibility) &&
  !isNil(details?.imoNumber);

export const fuelsAndEmissionsFactorsValidator = (fuelsAndEmissionsFactors: EmpFuelsAndEmissionsFactors[]): boolean =>
  fuelsAndEmissionsFactors?.length > 0 &&
  fuelsAndEmissionsFactors?.every((factors) => fuelsAndEmissionsFactorsItemValidator(factors));

const fuelsAndEmissionsFactorsItemValidator = (fuelsAndEmissionsFactors: EmpFuelsAndEmissionsFactors): boolean =>
  !isNil(fuelsAndEmissionsFactors?.methane) &&
  !isNil(fuelsAndEmissionsFactors?.carbonDioxide) &&
  !isNil(fuelsAndEmissionsFactors?.nitrousOxide) &&
  !isNil(fuelsAndEmissionsFactors?.origin) &&
  !isNil(fuelsAndEmissionsFactors?.densityMethodBunker) &&
  !isNil(fuelsAndEmissionsFactors?.densityMethodTank);

const fuelDetailsValidator = (fuel: AllFuelOriginTypeName) => {
  const isLNGValid = isLNG(fuel) ? !isNil(fuel?.methaneSlip) && !isNil(fuel?.methaneSlipValueType) : true;
  return !isNil(fuel?.uniqueIdentifier) && !isNil(fuel?.origin) && isLNGValid;
};

export const emissionsSourcesValidator = (
  emissionsSources: EmpEmissionsSources[],
  fuelsAndEmissionsFactors: EmpFuelsAndEmissionsFactors[],
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
    emissionsSources.every((sources) => emissionsSourcesItemValidator(sources)) &&
    allEmissionSourceFuelsIncluded
  );
};

export const emissionsSourcesItemValidator = (emissionsSources: EmpEmissionsSources): boolean =>
  !isNil(emissionsSources?.name) &&
  !isNil(emissionsSources?.type) &&
  !isNil(emissionsSources?.sourceClass) &&
  emissionsSources?.fuelDetails?.length > 0 &&
  emissionsSources?.fuelDetails?.every((item) => fuelDetailsValidator(item as AllFuelOriginTypeName) === true) &&
  emissionsSources?.monitoringMethod?.length > 0;

export const uncertaintyLevelValidator = (ship: EmpShipEmissions): boolean => {
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

export const measurementsValidator = (measurements: MeasurementDescription[]): boolean =>
  measurements?.length > 0 &&
  measurements?.every(
    (measurementDescription) =>
      !isNil(measurementDescription?.name) && measurementDescription?.emissionSources?.length > 0,
  );

export const carbonCaptureValidator = (carbonCapture: EmpCarbonCapture): boolean => {
  return (
    carbonCapture?.exist === false ||
    (carbonCapture?.exist === true &&
      !isNil(carbonCapture?.technologies?.description) &&
      carbonCapture?.technologies?.technologyEmissionSources?.length > 0)
  );
};

export const exemptionConditionsValidator = (exemptionConditions?: ExemptionConditions): boolean =>
  !isNil(exemptionConditions?.exist);

export const shipStepsCompletedMap: Record<shipEmissionKeys, (ship: EmpShipEmissions) => boolean> = {
  details: (ship: EmpShipEmissions): boolean => shipDetailsValidator(ship?.details),
  fuelsAndEmissionsFactors: (ship: EmpShipEmissions): boolean =>
    fuelsAndEmissionsFactorsValidator(ship?.fuelsAndEmissionsFactors),
  emissionsSources: (ship: EmpShipEmissions): boolean =>
    emissionsSourcesValidator(ship?.emissionsSources, ship?.fuelsAndEmissionsFactors),
  uncertaintyLevel: (ship: EmpShipEmissions): boolean => uncertaintyLevelValidator(ship),
  measurements: (ship: EmpShipEmissions): boolean => measurementsValidator(ship?.measurements),
  carbonCapture: (ship: EmpShipEmissions): boolean => carbonCaptureValidator(ship?.carbonCapture),
  exemptionConditions: (ship: EmpShipEmissions): boolean => exemptionConditionsValidator(ship?.exemptionConditions),
};

export const isShipWizardCompleted = (ship: EmpShipEmissions) => {
  for (const key of Object.keys(shipStepsCompletedMap)) {
    if (!shipStepsCompletedMap[key](ship)) {
      return false;
    }
  }
  return true;
};
