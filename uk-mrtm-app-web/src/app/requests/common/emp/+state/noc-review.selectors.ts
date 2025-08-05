import { EmissionsMonitoringPlanNotification, EmpNotificationDetailsOfChange } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile, NotificationReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, ReviewTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as ReviewTaskPayload,
);

const selectEmpNotificationAttachments: StateSelector<RequestTaskState, { [key: string]: string }> =
  createDescendingSelector(selectPayload, (payload) => payload?.empNotificationAttachments);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(empCommonQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl, payload) => {
    return (
      files?.map((id) => ({
        downloadUrl: downloadUrl + `${id}`,
        fileName: payload?.empNotificationAttachments[id],
      })) ?? []
    );
  });

const selectSectionsCompleted: StateSelector<RequestTaskState, ReviewTaskPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (subtask: string): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    selectSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.UNDECIDED,
  );
};

const selectIsSubtaskCompleted = (subtask: string): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(selectSectionsCompleted, (completed) => {
    const taskStatus = completed?.[subtask] as TaskItemStatus;
    return taskStatus === TaskItemStatus.ACCEPTED || taskStatus === TaskItemStatus.REJECTED;
  });
};

const selectEmpNotification: StateSelector<RequestTaskState, EmissionsMonitoringPlanNotification> =
  createDescendingSelector(selectPayload, (payload) => payload?.emissionsMonitoringPlanNotification);

const selectEmpNotificationDetailsOfChange: StateSelector<RequestTaskState, EmpNotificationDetailsOfChange> =
  createDescendingSelector(
    selectEmpNotification,
    (emissionsMonitoringPlanNotification) => emissionsMonitoringPlanNotification?.detailsOfChange,
  );

const selectReviewDecision: StateSelector<RequestTaskState, NotificationReviewDecisionUnion> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reviewDecision as NotificationReviewDecisionUnion,
);

const selectNotificationAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(empCommonQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl, payload) => {
    return (
      files?.map((id) => ({
        downloadUrl: downloadUrl + `${id}`,
        fileName: payload?.empNotificationAttachments[id],
      })) ?? []
    );
  });

export const nocReviewQuery = {
  selectPayload,
  selectEmpNotificationAttachments,
  selectSectionsCompleted,
  selectStatusForSubtask,
  selectIsSubtaskCompleted,
  selectAttachedFiles,
  selectReviewDecision,
  selectEmpNotification,
  selectEmpNotificationDetailsOfChange,
  selectNotificationAttachedFiles,
};
