import { AerFuelConsumption, AerPortEmissionsMeasurement, AerVoyage, AerVoyageDetails } from '@mrtm/api';

import {
  AER_DELETE_DIRECT_EMISSIONS_STEP,
  AER_DELETE_FUEL_CONSUMPTION_STEP,
  AER_DIRECT_EMISSIONS_STEP,
  AER_EMISSIONS_CALCULATIONS_STEP,
  AER_FUEL_CONSUMPTION_STEP,
  AER_SELECT_SHIP_STEP,
} from '@requests/common/aer/aer.consts';
import { AerVoyageItem } from '@requests/common/aer/aer.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AER_PORT_COUNTRIES, AER_PORT_COUNTRY_PORTS } from '@shared/constants';
import { AerJourneyTypeEnum } from '@shared/types';
import { isNil } from '@shared/utils';

export const AER_VOYAGES_SUB_TASK = 'voyages';

export enum AerVoyagesWizardStep {
  SUMMARY = '../',
  LIST_OF_VOYAGES = 'list-of-voyages',
  DELETE_VOYAGE = 'delete',
  SELECT_SHIP = AER_SELECT_SHIP_STEP,
  VOYAGE_DETAILS = 'details',
  FUEL_EMISSIONS = AER_EMISSIONS_CALCULATIONS_STEP,
  FUEL_EMISSIONS_SUMMARY = 'fuel-emissions-summary',
  DIRECT_EMISSIONS = AER_DIRECT_EMISSIONS_STEP,
  FUEL_CONSUMPTION = AER_FUEL_CONSUMPTION_STEP,
  UPLOAD_VOYAGES = 'upload-voyages',
  DELETE_FUEL_CONSUMPTION = AER_DELETE_FUEL_CONSUMPTION_STEP,
  DELETE_DIRECT_EMISSIONS = AER_DELETE_DIRECT_EMISSIONS_STEP,
}

export const getAerJourneyType = (voyageDetails: AerVoyageDetails): AerJourneyTypeEnum => {
  const { departurePort, arrivalPort } = voyageDetails ?? {};

  if (isNil(departurePort?.country) || isNil(arrivalPort?.country)) {
    return undefined;
  }

  const departureCountryType = AER_PORT_COUNTRIES?.[departurePort.country]?.type;
  const arrivalCountryType = AER_PORT_COUNTRIES?.[arrivalPort.country]?.type;
  const isDeparturePortNI = AER_PORT_COUNTRY_PORTS?.[departurePort.port]?.isNorthernIrelandPort;
  const isArrivalPortNI = AER_PORT_COUNTRY_PORTS?.[arrivalPort.port]?.isNorthernIrelandPort;

  switch (true) {
    case departureCountryType === 'GB' && arrivalCountryType === 'GB':
      return (isDeparturePortNI && !isArrivalPortNI) || (!isDeparturePortNI && isArrivalPortNI)
        ? AerJourneyTypeEnum.NI
        : AerJourneyTypeEnum.Domestic;
    case ((departureCountryType === 'GB' || arrivalCountryType === 'GB') &&
      (departureCountryType === 'EU' || arrivalCountryType === 'EU')) ||
      (departureCountryType === 'EU' && arrivalCountryType === 'EU'):
      return AerJourneyTypeEnum.EU;
    default:
      return AerJourneyTypeEnum.International;
  }
};

export const AER_VOYAGE_PARAM = 'voyageId';

export const emissionsMeasurementCompleted = (emission: AerPortEmissionsMeasurement): boolean =>
  !isNil(emission?.co2) && !isNil(emission?.ch4) && !isNil(emission?.n2o) && !isNil(emission?.total);

export const fuelConsumptionCompleted = (fuelConsumption: AerFuelConsumption): boolean =>
  !isNil(fuelConsumption?.totalConsumption) &&
  !isNil(fuelConsumption?.name) &&
  !isNil(fuelConsumption?.fuelOriginTypeName) &&
  !isNil(fuelConsumption?.measuringUnit) &&
  !isNil(fuelConsumption?.amount);

export const voyageSelectShipCompleted = (voyage: AerVoyageItem) => !isNil(voyage?.imoNumber);

export const voyageDetailsCompleted = (voyage: AerVoyageItem): boolean =>
  !isNil(voyage?.voyageDetails?.departurePort?.country) &&
  !isNil(voyage?.voyageDetails?.departurePort?.port) &&
  !isNil(voyage?.voyageDetails?.arrivalPort?.country) &&
  !isNil(voyage?.voyageDetails?.arrivalPort?.port) &&
  !isNil(voyage?.voyageDetails?.arrivalTime) &&
  !isNil(voyage?.voyageDetails?.departureTime);

/**
 * Validate totalEmissions/surrenderEmissions when voyages not uploaded via CSV
 */
export const voyageEmissionsCompleted = (voyage: AerVoyageItem, isUploadCSV = false): boolean => {
  const shouldValidateEmissions = isUploadCSV
    ? true
    : emissionsMeasurementCompleted(voyage?.totalEmissions) &&
      emissionsMeasurementCompleted(voyage?.surrenderEmissions);

  const hasAtLeastOneEmissionCategory = !isNil(voyage.directEmissions) || voyage?.fuelConsumptions?.length > 0;

  return (
    (isNil(voyage.directEmissions) ||
      emissionsMeasurementCompleted(voyage.directEmissions) ||
      (voyage?.fuelConsumptions?.length && voyage?.fuelConsumptions?.every(fuelConsumptionCompleted))) &&
    shouldValidateEmissions &&
    hasAtLeastOneEmissionCategory
  );
};

export const aerVoyageStepsCompletedMap: Record<
  keyof (Pick<AerVoyage, 'imoNumber' | 'voyageDetails'> & { voyageEmissions: unknown }),
  (voyage: AerVoyage, isUploadCSV?: boolean) => boolean
> = {
  imoNumber: voyageSelectShipCompleted,
  voyageDetails: voyageDetailsCompleted,
  voyageEmissions: voyageEmissionsCompleted,
};

export const isVoyageWizardCompleted = (voyage: AerVoyageItem, isUploadCSV = false) => {
  for (const key of Object.keys(aerVoyageStepsCompletedMap)) {
    if (!aerVoyageStepsCompletedMap[key](voyage, isUploadCSV)) {
      return false;
    }
  }

  return true;
};

export const isWizardCompleted = (
  voyages: Array<AerVoyageItem & { status: TaskItemStatus }>,
  isUploadCSV = false,
): boolean =>
  voyages?.length &&
  voyages.every((voyage) => voyage.status === TaskItemStatus.COMPLETED && isVoyageWizardCompleted(voyage, isUploadCSV));
