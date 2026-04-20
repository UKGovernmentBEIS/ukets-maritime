import { isNil } from 'lodash-es';

import {
  AerPortEmissionsMeasurement,
  AerShipAggregatedData,
  AerShipAggregatedDataSave,
  AerShipEmissions,
} from '@mrtm/api';

import { AER_SELECT_SHIP_STEP } from '@requests/common/aer/aer.consts';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerAggregatedDataEmissionDto } from '@shared/types';

export const AER_AGGREGATED_DATA_SUB_TASK = 'aggregatedData';

export const AER_AGGREGATED_DATA_SUB_TASK_PATH = 'aggregated-data';

export const AER_AGGREGATED_DATA_PARAM = 'dataId';

export enum AerAggregatedDataWizardStep {
  SUMMARY = '../',
  LIST_OF_AGGREGATED_DATA = 'list-of-aggregated-data',
  AGGREGATED_DATA_SUMMARY = 'aggregated-data-summary',
  DELETE_AGGREGATED_DATA = 'delete',
  SELECT_SHIP = AER_SELECT_SHIP_STEP,
  FUEL_CONSUMPTION = 'fuel-consumption',
  ANNUAL_EMISSIONS = 'annual-emissions',
  SHIP_EMISSIONS = 'ship-emissions',
  FETCH_FROM_VOYAGES_AND_PORTS = 'import',
  UPLOAD_AGGREGATED_DATA = 'upload-aggregated-data',
}

export const mapAggregatedDataToTotalShipEmissionsItems = (
  aggregatedData: AerShipAggregatedData,
): Array<AerAggregatedDataEmissionDto> => [
  { emission: 'Total emissions from voyages and in port', ...aggregatedData?.totalEmissionsFromVoyagesAndPorts },
  { emission: 'Less Northern Ireland surrender deduction', ...aggregatedData?.lessVoyagesInNorthernIrelandDeduction },
  { emission: 'Emissions figure for surrender', total: aggregatedData?.surrenderEmissions, isSummary: true },
];

export const mapAggregatedDataToAnnualEmissionsItems = (
  aggregatedData: AerShipAggregatedData,
): Array<AerAggregatedDataEmissionDto> => [
  {
    emission: 'Aggregated greenhouse gas emissions which occurred within UK ports',
    ...aggregatedData?.emissionsWithinUKPorts,
  },
  {
    emission: 'Aggregated greenhouse gas emissions from all voyages between UK ports',
    ...aggregatedData?.emissionsBetweenUKPorts,
  },
  {
    emission: 'Aggregated greenhouse gas emissions from all voyages between Great Britain and Northern Ireland',
    ...aggregatedData?.emissionsBetweenUKAndNIVoyages,
  },
  {
    emission: 'Total aggregated greenhouse gas emitted',
    ...aggregatedData?.totalEmissionsFromVoyagesAndPorts,
    isSummary: true,
  },
];

export const aggregatedDataSelectShipCompleted = (data: AerShipAggregatedData) => !isNil(data?.imoNumber);

const isValidAggregatedEmissionsMeasurement = (emission: AerPortEmissionsMeasurement): boolean =>
  !isNil(emission?.co2) && !isNil(emission?.ch4) && !isNil(emission?.n2o) && !isNil(emission?.total);

export const isValidFuelConsumptions = (data: AerShipAggregatedData): boolean =>
  data?.fuelConsumptions?.length &&
  data?.fuelConsumptions.every(
    (fuelConsumption) => !isNil(fuelConsumption?.totalConsumption) && !isNil(fuelConsumption?.fuelOriginTypeName),
  );

export const aerAggregatedDataStepsCompleted: Record<
  keyof Pick<
    AerShipAggregatedDataSave,
    | 'imoNumber'
    | 'fuelConsumptions'
    | 'emissionsWithinUKPorts'
    | 'emissionsBetweenUKPorts'
    | 'emissionsBetweenUKAndNIVoyages'
  >,
  (data: AerShipAggregatedData & { relatedShip: AerShipEmissions }) => boolean
> = {
  imoNumber: aggregatedDataSelectShipCompleted,
  fuelConsumptions: isValidFuelConsumptions,
  emissionsWithinUKPorts: (data: AerShipAggregatedData) =>
    isValidAggregatedEmissionsMeasurement(data?.emissionsWithinUKPorts),
  emissionsBetweenUKPorts: (data: AerShipAggregatedData) =>
    isValidAggregatedEmissionsMeasurement(data?.emissionsBetweenUKPorts),
  emissionsBetweenUKAndNIVoyages: (data: AerShipAggregatedData) =>
    isValidAggregatedEmissionsMeasurement(data?.emissionsBetweenUKAndNIVoyages),
};

export const isAggregatedDataWizardCompleted = (data: AerShipAggregatedData) => {
  for (const key of Object.keys(aerAggregatedDataStepsCompleted)) {
    if (!aerAggregatedDataStepsCompleted[key](data)) {
      return false;
    }
  }

  return true;
};

export const isWizardCompleted = (aggregatedData: Array<AerShipAggregatedData & { status: TaskItemStatus }>): boolean =>
  aggregatedData.length && aggregatedData.every((data) => data.status === TaskItemStatus.COMPLETED);
