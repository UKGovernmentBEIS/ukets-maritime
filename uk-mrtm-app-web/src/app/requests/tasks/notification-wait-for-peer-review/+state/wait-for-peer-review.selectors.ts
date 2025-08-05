import {
  EmissionsMonitoringPlanNotification,
  EmpNotificationDetailsOfChange,
  EmpNotificationReviewDecision,
} from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { WaitForPeerReviewTaskPayload } from '@requests/tasks/notification-wait-for-peer-review/wait-for-peer-review.types';
import { AttachedFile, NotificationReviewDecisionUnion } from '@shared/types';

const selectPayload = empCommonQuery.selectPayload<WaitForPeerReviewTaskPayload>();

const selectDecisionType: StateSelector<RequestTaskState, EmpNotificationReviewDecision['type']> =
  createDescendingSelector(selectPayload, (payload) => payload.reviewDecision.type);

const selectEmpNotification: StateSelector<RequestTaskState, EmissionsMonitoringPlanNotification> =
  createDescendingSelector(selectPayload, (payload) => payload?.emissionsMonitoringPlanNotification);

const selectEmpNotificationDetailsOfChange: StateSelector<RequestTaskState, EmpNotificationDetailsOfChange> =
  createDescendingSelector(
    selectEmpNotification,
    (emissionsMonitoringPlanNotification) => emissionsMonitoringPlanNotification?.detailsOfChange,
  );

const selectReviewDecision: StateSelector<RequestTaskState, NotificationReviewDecisionUnion> = createDescendingSelector(
  selectPayload,
  (payload) => payload.reviewDecision as NotificationReviewDecisionUnion,
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

export const waitForPeerReviewQuery = {
  selectPayload,
  selectDecisionType,
  selectEmpNotificationDetailsOfChange,
  selectReviewDecision,
  selectNotificationAttachedFiles,
};
