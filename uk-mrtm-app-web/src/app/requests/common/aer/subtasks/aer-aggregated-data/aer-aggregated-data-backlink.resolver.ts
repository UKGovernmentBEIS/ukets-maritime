import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerShipAggregatedData, AerShipEmissions } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AER_AGGREGATED_DATA_PARAM,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

const selectShipBacklinkResolver = (returnToSummary: boolean, activatedRoute: ActivatedRouteSnapshot): string => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  return returnToSummary ? '../' : !isNil(dataId) ? '../../' : '../';
};

const selectFuelConsumptionBacklinkResolver = (
  returnToSummary: boolean,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  return returnToSummary ? '../' : !isNil(dataId) ? `../${AerAggregatedDataWizardStep.SELECT_SHIP}` : '../';
};

const selectAnnualEmissionsBacklinkResolver = (
  returnToSummary: boolean,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  return returnToSummary ? '../' : !isNil(dataId) ? `../${AerAggregatedDataWizardStep.FUEL_CONSUMPTION}` : '../';
};

const selectSmallIslandEmissionsBacklinkResolver = (
  returnToSummary: boolean,
  activatedRoute: ActivatedRouteSnapshot,
): string => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  return returnToSummary ? '../' : !isNil(dataId) ? `../${AerAggregatedDataWizardStep.ANNUAL_EMISSIONS}` : '../';
};

const listOfAggregatedDataBacklinkResolver = (returnToSummary: boolean): string => {
  return returnToSummary ? '../' : '../../../';
};

const shipEmissionsSummaryBacklinkResolver = (
  returnToSummary: boolean,
  activatedRoute: ActivatedRouteSnapshot,
  aggregatedData: Array<AerShipAggregatedData & { status?: TaskItemStatus; relatedShip?: AerShipEmissions }>,
) => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  const aggregatedDataItem = aggregatedData?.find(
    (aggregatedDataItem) => aggregatedDataItem.uniqueIdentifier === dataId,
  );

  const prevStep = aggregatedDataItem?.relatedShip?.derogations?.smallIslandFerryOperatorReduction
    ? AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS
    : AerAggregatedDataWizardStep.ANNUAL_EMISSIONS;

  return returnToSummary ? '../' : !isNil(dataId) ? `../${prevStep}` : '../';
};

const stepBacklinkResolvers: Partial<
  Record<
    AerAggregatedDataWizardStep,
    (
      returnToSummary: boolean,
      activatedRoute: ActivatedRouteSnapshot,
      aggregatedData: Array<AerShipAggregatedData & { status?: TaskItemStatus; relatedShip?: AerShipEmissions }>,
    ) => string
  >
> = {
  [AerAggregatedDataWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA]: listOfAggregatedDataBacklinkResolver,
  [AerAggregatedDataWizardStep.FUEL_CONSUMPTION]: selectFuelConsumptionBacklinkResolver,
  [AerAggregatedDataWizardStep.ANNUAL_EMISSIONS]: selectAnnualEmissionsBacklinkResolver,
  [AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS]: selectSmallIslandEmissionsBacklinkResolver,
  [AerAggregatedDataWizardStep.SHIP_EMISSIONS]: shipEmissionsSummaryBacklinkResolver,
};

export const aerAggregatedDataBacklinkResolver =
  (step: AerAggregatedDataWizardStep): ResolveFn<unknown> =>
  (route: ActivatedRouteSnapshot) => {
    const isChange = route.queryParamMap.get('change') === 'true';
    const store = inject(RequestTaskStore);
    const aggregatedData = store.select(aerCommonQuery.selectAllAggregatedData)();

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(!!isChange, route, aggregatedData) : './';
  };
