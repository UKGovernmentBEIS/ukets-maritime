import { Provider } from '@angular/core';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AER_OBJECT_ROUTE_KEY,
  AER_RELATED_SHIP_SELECTOR,
  AER_SUBTASK,
  AER_SUBTASK_LIST_MAP,
} from '@requests/common/aer/aer.consts';
import {
  AER_DIRECT_EMISSIONS_SELECTOR,
  AER_EMISSIONS_CALCULATIONS_SELECTOR,
  AER_FUEL_CONSUMPTION_SELECTOR,
  AER_SELECT_SHIP_QUERY_SELECTOR,
  AER_SELECT_SHIP_SUBMIT_NEXT_STEP,
  AER_SELECT_SHIPS_ITEMS_SELECTOR,
} from '@requests/common/aer/components';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';

export const aerPortsRouteProviders: Array<Provider> = [
  { provide: AER_OBJECT_ROUTE_KEY, useValue: 'portId' },
  { provide: AER_SUBTASK, useValue: AER_PORTS_SUB_TASK },
  { provide: AER_SUBTASK_LIST_MAP, useValue: aerPortsMap },
  { provide: AER_SELECT_SHIP_QUERY_SELECTOR, useValue: aerCommonQuery.selectPort },
  { provide: AER_SELECT_SHIP_SUBMIT_NEXT_STEP, useValue: AerPortsWizardStep.PORT_DETAILS },
  { provide: AER_SELECT_SHIPS_ITEMS_SELECTOR, useValue: () => aerCommonQuery.selectListOfShips },
  { provide: AER_DIRECT_EMISSIONS_SELECTOR, useValue: aerCommonQuery.selectPortDirectEmissions },
  { provide: AER_RELATED_SHIP_SELECTOR, useValue: aerCommonQuery.selectRelatedShipForPort },
  { provide: AER_FUEL_CONSUMPTION_SELECTOR, useValue: aerCommonQuery.selectPortFuelConsumption },
  { provide: AER_EMISSIONS_CALCULATIONS_SELECTOR, useValue: aerCommonQuery.selectPort },
];
