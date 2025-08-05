import { InjectionToken } from '@angular/core';

import { RequestTaskState, StateSelector } from '@netz/common/store';

import { AerSelectShipFormModel } from '@requests/common/aer/components/aer-select-ship/aer-select-ship.types';
import { ShipEmissionTableListItem } from '@shared/types';

export type AerShipStateQuery = (id: string) => StateSelector<RequestTaskState, AerSelectShipFormModel>;

export const AER_SELECT_SHIP_SUBMIT_NEXT_STEP: InjectionToken<string> = new InjectionToken<string>(
  'Aer select ship submit next step',
);
export const AER_SELECT_SHIP_QUERY_SELECTOR: InjectionToken<AerShipStateQuery> = new InjectionToken<AerShipStateQuery>(
  'Aer select ship selector',
);

export const AER_SELECT_SHIPS_ITEMS_SELECTOR: InjectionToken<
  (objectId: string) => StateSelector<RequestTaskState, Array<ShipEmissionTableListItem>>
> = new InjectionToken<(objectId: string) => StateSelector<RequestTaskState, Array<ShipEmissionTableListItem>>>(
  'Aer select ship items selector',
);
