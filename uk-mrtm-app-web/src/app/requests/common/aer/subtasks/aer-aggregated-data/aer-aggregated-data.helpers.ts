import { isNil } from 'lodash-es';

import {
  AerAggregatedEmissionsMeasurement,
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
  SMALL_ISLAND_EMISSIONS = 'small-island-emissions',
  SHIP_EMISSIONS = 'ship-emissions',
  FETCH_FROM_VOYAGES_AND_PORTS = 'import',
  UPLOAD_AGGREGATED_DATA = 'upload-aggregated-data',
}

export const mapAggregatedDataToSurrenderEmissionsItems = (
  aggregatedData: AerShipAggregatedData,
): Array<AerAggregatedDataEmissionDto> => [
  { emission: 'Less small island ferry deduction', ...aggregatedData?.lessIslandFerryDeduction },
  { emission: 'Less 5% ice class deduction', ...aggregatedData?.less5PercentIceClassDeduction },
  { emission: 'Emissions figure for surrender', total: aggregatedData?.surrenderEmissions, isSummary: true },
];

export const mapAggregatedDataToTotalShipEmissionsItems = (
  aggregatedData: AerShipAggregatedData,
): Array<AerAggregatedDataEmissionDto> => [
  { emission: 'Total emissions from voyages and in port', ...aggregatedData?.totalEmissionsFromVoyagesAndPorts },
  { emission: 'Less captured CO2', ...aggregatedData?.lessCapturedCo2 },
  { emission: 'Less voyages not in scope', ...aggregatedData?.lessVoyagesNotInScope },
  { emission: 'Total ship emissions', total: aggregatedData?.totalShipEmissions, isSummary: true },
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
    emission: 'Aggregated greenhouse gas emissions from all voyages between the UK and EEA',
    ...aggregatedData?.emissionsBetweenUKAndEEAVoyages,
  },
  { emission: 'Total aggregated greenhouse gas emitted', ...aggregatedData?.totalAggregatedEmissions, isSummary: true },
];

export const mapAggregatedDataToSmallIslandReductionItems = (
  aggregatedData: AerShipAggregatedData,
): Array<AerAggregatedDataEmissionDto> => [
  {
    emission: 'Emissions eligible for small island ferry operator surrender reduction',
    ...aggregatedData?.smallIslandSurrenderReduction,
  },
];

export const aggregatedDataSelectShipCompleted = (data: AerShipAggregatedData) => !isNil(data?.imoNumber);

export const isValidPortEmissionsMeasurement = (emission: AerPortEmissionsMeasurement): boolean =>
  !isNil(emission?.co2) && !isNil(emission?.ch4) && !isNil(emission?.n2o) && !isNil(emission?.total);

export const isValidEmissions = (data: AerAggregatedEmissionsMeasurement): boolean =>
  isValidPortEmissionsMeasurement(data) && !isNil(data?.co2Captured);

export const isValidFuelConsumptions = (data: AerShipAggregatedData): boolean =>
  data?.fuelConsumptions?.length &&
  data?.fuelConsumptions.every(
    (fuelConsumption) => !isNil(fuelConsumption?.totalConsumption) && !isNil(fuelConsumption?.fuelOriginTypeName),
  );

export const isSmallIslandSurrenderReduction = (
  data: AerShipAggregatedData & { relatedShip: AerShipEmissions },
): boolean =>
  !data?.relatedShip?.derogations?.smallIslandFerryOperatorReduction ||
  (data?.relatedShip?.derogations?.smallIslandFerryOperatorReduction &&
    isValidEmissions(data?.smallIslandSurrenderReduction));

export const aerAggregatedDataStepsCompleted: Record<
  keyof Omit<AerShipAggregatedDataSave, 'totalEmissionsFromVoyagesAndPorts' | 'uniqueIdentifier' | 'fromFetch'>,
  (data: AerShipAggregatedData & { relatedShip: AerShipEmissions }) => boolean
> = {
  imoNumber: aggregatedDataSelectShipCompleted,
  emissionsWithinUKPorts: (data: AerShipAggregatedData) => isValidEmissions(data?.emissionsWithinUKPorts),
  emissionsBetweenUKAndEEAVoyages: (data: AerShipAggregatedData) =>
    isValidEmissions(data?.emissionsBetweenUKAndEEAVoyages),
  emissionsBetweenUKPorts: (data: AerShipAggregatedData) => isValidEmissions(data?.emissionsBetweenUKPorts),
  fuelConsumptions: isValidFuelConsumptions,
  smallIslandSurrenderReduction: isSmallIslandSurrenderReduction,
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
