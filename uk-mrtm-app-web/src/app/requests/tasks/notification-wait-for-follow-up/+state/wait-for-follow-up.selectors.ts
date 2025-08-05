import { createDescendingSelector, requestTaskQuery, RequestTaskState, StateSelector } from '@netz/common/store';

import { WaitForFollowUpTaskPayload } from '@requests/tasks/notification-wait-for-follow-up/wait-for-follow-up.types';

const selectPayload: StateSelector<RequestTaskState, WaitForFollowUpTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as WaitForFollowUpTaskPayload,
);

export const waitForFollowUpQuery = {
  selectPayload,
};
