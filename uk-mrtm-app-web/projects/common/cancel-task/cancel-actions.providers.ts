import { InjectionToken, Type } from '@angular/core';

import { RequestTaskActionProcessDTO, RequestTaskDTO } from '@mrtm/api';

export type CancelActionsMap = Record<
  RequestTaskDTO['type'],
  { actionType: RequestTaskActionProcessDTO['requestTaskActionType'] }
>;

export type CancelSuccessComponentMap = Record<RequestTaskDTO['type'], Type<unknown>>;

export const CANCEL_ACTIONS_MAP = new InjectionToken<CancelActionsMap>('Cancel actions map');
export const CANCEL_ACTION_SUCCESS_COMPONENT = new InjectionToken<CancelSuccessComponentMap>(
  'Cancel action success component',
);
