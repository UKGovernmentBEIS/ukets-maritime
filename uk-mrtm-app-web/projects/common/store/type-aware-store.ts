import { InjectionToken } from '@angular/core';

import { RequestActionState, RequestActionStore } from './request-action';
import { RequestTaskState, RequestTaskStore } from './request-task';
import { createSelector, StateSelector } from './signal-store';

export const TYPE_AWARE_STORE = new InjectionToken<RequestTaskStore | RequestActionStore>('Type aware store');
export const ITEM_TYPE_TO_RETURN_TEXT_MAPPER = new InjectionToken<(type: string, year?: string | number) => string>(
  'Item type to return-text mapper',
);

export const selectType: StateSelector<RequestTaskState | RequestActionState, string | null> = createSelector(
  (state) =>
    'action' in state
      ? state.action?.type
      : 'requestTaskItem' in state
        ? state.requestTaskItem?.requestTask?.type
        : null,
);

export const selectRequestId: StateSelector<RequestTaskState | RequestActionState, string> = createSelector((state) =>
  'action' in state
    ? state.action?.requestId
    : 'requestTaskItem' in state
      ? state.requestTaskItem?.requestInfo?.id
      : null,
);
