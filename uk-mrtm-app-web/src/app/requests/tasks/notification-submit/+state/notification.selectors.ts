import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationTaskPayload } from '@requests/tasks/notification-submit/notification.types';
import { isWizardCompleted } from '@requests/tasks/notification-submit/subtasks/details-change/details-change.wizard';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, NotificationTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as NotificationTaskPayload,
);

const selectStatusForSubtask = (
  subtask: 'submitToRegulator' | 'detailsOfChange',
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(selectPayload, (payload) => {
    const detailsOfChange =
      isWizardCompleted(payload?.emissionsMonitoringPlanNotification?.detailsOfChange) &&
      payload.sectionsCompleted?.['detailsOfChange'] === TaskItemStatus.COMPLETED
        ? TaskItemStatus.COMPLETED
        : isWizardCompleted(payload?.emissionsMonitoringPlanNotification?.detailsOfChange) &&
            payload.sectionsCompleted?.['detailsOfChange'] === TaskItemStatus.IN_PROGRESS
          ? TaskItemStatus.IN_PROGRESS
          : TaskItemStatus.NOT_STARTED;

    switch (subtask) {
      case 'submitToRegulator':
        return detailsOfChange !== TaskItemStatus.COMPLETED
          ? TaskItemStatus.CANNOT_START_YET
          : TaskItemStatus.NOT_STARTED;
      case 'detailsOfChange':
        return detailsOfChange;
    }
  });

const selectDetailsOfChange: StateSelector<RequestTaskState, EmpNotificationDetailsOfChange> = createDescendingSelector(
  selectPayload,
  (payload) => payload.emissionsMonitoringPlanNotification?.detailsOfChange,
);

const selectAttachments: StateSelector<RequestTaskState, { [key: string]: string }> = createDescendingSelector(
  selectPayload,
  (payload) => payload.empNotificationAttachments,
);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(empCommonQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl: string, payload) =>
    files?.map((id) => ({
      downloadUrl: `${downloadUrl}${id}`,
      fileName: payload?.empNotificationAttachments[id],
    })),
  );

export const notificationQuery = {
  selectPayload,
  selectStatusForSubtask,
  selectDetailsOfChange,
  selectAttachments,
  selectAttachedFiles,
};
