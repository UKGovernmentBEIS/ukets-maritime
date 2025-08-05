import {
  EmissionsMonitoringPlanNotification,
  EmpNotificationApplicationSubmittedRequestActionPayload,
  EmpNotificationDetailsOfChange,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpNotificationApplicationSubmittedRequestActionPayload> =
  timelineCommonQuery.selectPayload<EmpNotificationApplicationSubmittedRequestActionPayload>();

const selectEmpNotification: StateSelector<RequestActionState, EmissionsMonitoringPlanNotification> =
  createDescendingSelector(selectPayload, (payload) => payload?.emissionsMonitoringPlanNotification);

const selectEmpNotificationDetailsOfChange: StateSelector<RequestActionState, EmpNotificationDetailsOfChange> =
  createDescendingSelector(
    selectEmpNotification,
    (emissionsMonitoringPlanNotification) => emissionsMonitoringPlanNotification?.detailsOfChange,
  );

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(timelineCommonQuery.selectDownloadUrl, selectPayload, (downloadUrl, payload) =>
    timelineUtils.getAttachedFiles(files, payload?.empNotificationAttachments, downloadUrl),
  );

export const notificationSubmittedQuery = {
  selectPayload,
  selectEmpNotificationDetailsOfChange,
  selectAttachedFiles,
};
