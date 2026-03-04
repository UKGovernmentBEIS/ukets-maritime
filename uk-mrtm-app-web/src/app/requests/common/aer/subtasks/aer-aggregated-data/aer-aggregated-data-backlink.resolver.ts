import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import {
  AER_AGGREGATED_DATA_PARAM,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { isNil } from '@shared/utils';

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

const shipEmissionsSummaryBacklinkResolver = (returnToSummary: boolean, activatedRoute: ActivatedRouteSnapshot) => {
  const dataId = activatedRoute.params?.[AER_AGGREGATED_DATA_PARAM];
  return returnToSummary ? '../' : !isNil(dataId) ? `../${AerAggregatedDataWizardStep.ANNUAL_EMISSIONS}` : '../';
};

const stepBacklinkResolvers: Partial<
  Record<AerAggregatedDataWizardStep, (returnToSummary: boolean, activatedRoute: ActivatedRouteSnapshot) => string>
> = {
  [AerAggregatedDataWizardStep.SELECT_SHIP]: selectShipBacklinkResolver,
  [AerAggregatedDataWizardStep.FUEL_CONSUMPTION]: selectFuelConsumptionBacklinkResolver,
  [AerAggregatedDataWizardStep.ANNUAL_EMISSIONS]: selectAnnualEmissionsBacklinkResolver,
  [AerAggregatedDataWizardStep.SHIP_EMISSIONS]: shipEmissionsSummaryBacklinkResolver,
};

export const aerAggregatedDataBacklinkResolver =
  (step: AerAggregatedDataWizardStep): ResolveFn<unknown> =>
  (route: ActivatedRouteSnapshot) => {
    const isChange = route.queryParamMap.get('change') === 'true';

    const resolverFn = stepBacklinkResolvers[step];
    return resolverFn ? resolverFn(!!isChange, route) : './';
  };
