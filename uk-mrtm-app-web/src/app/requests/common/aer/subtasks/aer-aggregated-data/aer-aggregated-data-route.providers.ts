import { Provider } from '@angular/core';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_OBJECT_ROUTE_KEY, AER_SUBTASK, AER_SUBTASK_LIST_MAP } from '@requests/common/aer/aer.consts';
import {
  AER_SELECT_SHIP_QUERY_SELECTOR,
  AER_SELECT_SHIP_SUBMIT_NEXT_STEP,
  AER_SELECT_SHIPS_ITEMS_SELECTOR,
} from '@requests/common/aer/components';
import {
  AER_AGGREGATED_DATA_PARAM,
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';

export const aerAggregatedDataRouteProviders: Array<Provider> = [
  { provide: AER_SUBTASK, useValue: AER_AGGREGATED_DATA_SUB_TASK },
  { provide: AER_OBJECT_ROUTE_KEY, useValue: AER_AGGREGATED_DATA_PARAM },
  { provide: AER_SUBTASK_LIST_MAP, useValue: aerAggregatedDataSubtasksListMap },
  { provide: AER_SELECT_SHIP_QUERY_SELECTOR, useValue: aerCommonQuery.selectAggregatedDataItem },
  { provide: AER_SELECT_SHIP_SUBMIT_NEXT_STEP, useValue: AerAggregatedDataWizardStep.FUEL_CONSUMPTION },
  { provide: AER_SELECT_SHIPS_ITEMS_SELECTOR, useValue: aerCommonQuery.selectListOfShipsWithoutAggregatedData },
];
