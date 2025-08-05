import { RequestActionDTO, RequestActionPayload } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '../index';
import { RequestActionState } from './request-action.state';

const selectAction: StateSelector<RequestActionState, RequestActionDTO> = createSelector((state) => state.action);

const selectActionType: StateSelector<RequestActionState, RequestActionDTO['type']> = createDescendingSelector(
  selectAction,
  (action) => action?.type,
);

const selectRequestId: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectAction,
  (action) => action?.requestId,
);

const selectActionPayload: StateSelector<RequestActionState, RequestActionPayload> = createDescendingSelector(
  selectAction,
  (action) => action?.payload,
);

const selectSubmitter: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectAction,
  (action) => action?.submitter,
);

export const requestActionQuery = {
  selectAction,
  selectActionType,
  selectRequestId,
  selectActionPayload,
  selectSubmitter,
};
