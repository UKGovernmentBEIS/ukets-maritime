import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerAggregatedDataWizardStep } from '@requests/common/aer/subtasks/aer-aggregated-data';
import {
  isAggregatedDataWizardCompleted,
  isWizardCompleted,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const canActivateAggregatedDataListSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(RequestTaskStore);
  const subtaskStatus = store.select(aerCommonQuery.selectStatusForAggregatedDataSubtask)();
  const aggregatedData = store.select(aerCommonQuery.selectAllAggregatedData)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (route.fragment === AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA && !isWizardCompleted(aggregatedData)) {
    return createUrlTreeFromSnapshot(route, ['../../']);
  }

  return (
    !isEditable ||
    (isEditable && (subtaskStatus === TaskItemStatus.COMPLETED || isWizardCompleted(aggregatedData))) ||
    createUrlTreeFromSnapshot(route, [AerAggregatedDataWizardStep.LIST_OF_AGGREGATED_DATA])
  );
};

export const canActivateAggregatedDataSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dataId = route.params?.dataId;
  if (!dataId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const aggregatedData = store.select(aerCommonQuery.selectAggregatedDataItem(dataId))();

  return (
    aggregatedData.fromFetch ||
    isAggregatedDataWizardCompleted(aggregatedData) ||
    createUrlTreeFromSnapshot(route, [AerAggregatedDataWizardStep.FUEL_CONSUMPTION])
  );
};

export const canActivateAggregatedDataEdit: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dataId = route.params?.dataId;

  if (!dataId) {
    return false;
  }

  const store = inject(RequestTaskStore);
  const editable = store.select(requestTaskQuery.selectIsEditable)();
  const aggregatedData = store.select(aerCommonQuery.selectAggregatedDataItem(dataId))();

  return (
    (!aggregatedData?.fromFetch && aggregatedData.dataInputType !== 'EXTERNAL_PROVIDER' && editable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
