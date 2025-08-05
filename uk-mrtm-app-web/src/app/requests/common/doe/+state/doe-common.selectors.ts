import { DoeApplicationSubmitRequestTaskPayload, DoeMaritimeEmissions } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile } from '@shared/types';

export const selectPayload: StateSelector<RequestTaskState, DoeApplicationSubmitRequestTaskPayload> =
  createDescendingSelector(
    requestTaskQuery.selectRequestTaskPayload,
    (payload) => payload as DoeApplicationSubmitRequestTaskPayload,
  );

const selectSectionsCompleted: StateSelector<
  RequestTaskState,
  DoeApplicationSubmitRequestTaskPayload['sectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (
  subtask: keyof DoeApplicationSubmitRequestTaskPayload['doe'] | string,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(selectSectionsCompleted, (sectionsCompleted) => {
    return (sectionsCompleted?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED;
  });
};

const selectIsSubtaskCompleted = (
  subtask: keyof DoeApplicationSubmitRequestTaskPayload['doe'],
): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectStatusForSubtask(subtask),
    (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectReportingYear: StateSelector<RequestTaskState, string> = createDescendingSelector(
  requestTaskQuery.selectRequestId,
  (requestId) => getYearFromRequestId(requestId),
);

const selectAttachments: StateSelector<RequestTaskState, { [key: string]: string }> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.doeAttachments,
);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(requestTaskQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl: string, payload) =>
    files?.map((id) => ({ downloadUrl: `${downloadUrl}${id}`, fileName: payload?.doeAttachments[id] })),
  );

const selectMaritimeEmissions: StateSelector<RequestTaskState, DoeMaritimeEmissions> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.doe?.maritimeEmissions,
);

export const doeCommonQuery = {
  selectPayload,
  selectMaritimeEmissions,
  selectSectionsCompleted,
  selectStatusForSubtask,
  selectIsSubtaskCompleted,
  selectReportingYear,
  selectAttachments,
  selectAttachedFiles,
};
