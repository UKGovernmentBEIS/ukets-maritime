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
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { AER_VOYAGE_PARAM } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';

export const aerVoyagesRouteProviders: Array<Provider> = [
  { provide: AER_SUBTASK, useValue: AER_VOYAGES_SUB_TASK },
  { provide: AER_OBJECT_ROUTE_KEY, useValue: AER_VOYAGE_PARAM },
  { provide: AER_SUBTASK_LIST_MAP, useValue: aerVoyagesMap },
  { provide: AER_SELECT_SHIP_QUERY_SELECTOR, useValue: aerCommonQuery.selectVoyage },
  { provide: AER_SELECT_SHIP_SUBMIT_NEXT_STEP, useValue: AerVoyagesWizardStep.VOYAGE_DETAILS },
  { provide: AER_SELECT_SHIPS_ITEMS_SELECTOR, useValue: () => aerCommonQuery.selectListOfShips },
  { provide: AER_DIRECT_EMISSIONS_SELECTOR, useValue: aerCommonQuery.selectVoyageDirectEmissions },
  { provide: AER_RELATED_SHIP_SELECTOR, useValue: aerCommonQuery.selectRelatedShipForVoyage },
  { provide: AER_FUEL_CONSUMPTION_SELECTOR, useValue: aerCommonQuery.selectVoyageFuelConsumption },
  { provide: AER_EMISSIONS_CALCULATIONS_SELECTOR, useValue: aerCommonQuery.selectVoyage },
];
