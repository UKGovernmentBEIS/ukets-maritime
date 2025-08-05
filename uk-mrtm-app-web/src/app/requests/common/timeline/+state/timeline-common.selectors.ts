import { createDescendingSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';

const selectPayload = <T>(): StateSelector<RequestActionState, T> =>
  createDescendingSelector(requestActionQuery.selectActionPayload, (payload) => payload as T);

const selectDownloadUrl: StateSelector<RequestActionState, string> = createDescendingSelector(
  requestActionQuery.selectAction,
  (action) => {
    const actionId = action?.id;
    const requestTaskId = action?.requestId;
    return `/tasks/${requestTaskId}/timeline/${actionId}/file-download/`;
  },
);

const selectReportingYear: StateSelector<RequestActionState, string> = createDescendingSelector(
  requestActionQuery.selectRequestId,
  (requestId) => getYearFromRequestId(requestId),
);

export const timelineCommonQuery = {
  selectPayload,
  selectDownloadUrl,
  selectReportingYear,
};
