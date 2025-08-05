import { EmissionsMonitoringPlanNotification, EmpNotificationDetailsOfChange } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { PeerReviewTaskPayload } from '@requests/tasks/notification-peer-review/peer-review.types';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-peer-review/subtasks/details-change';
import { AttachedFile, NotificationReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, PeerReviewTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as PeerReviewTaskPayload,
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

const selectSectionsCompleted: StateSelector<RequestTaskState, PeerReviewTaskPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    selectSectionsCompleted,
    (completed) => completed?.[DETAILS_CHANGE_SUB_TASK] as TaskItemStatus,
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

export const peerReviewQuery = {
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
