import { DecisionNotification, EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { AttachedFile, NotificationReviewDecisionUnion, NotifyAccountOperatorUsersInfo } from '@shared/types';

const selectPayload: StateSelector<
  RequestActionState,
  EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload
> = timelineCommonQuery.selectPayload<EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload>();

const selectReviewDecision: StateSelector<RequestActionState, NotificationReviewDecisionUnion> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewDecision as NotificationReviewDecisionUnion);

const selectUsersInfo: StateSelector<RequestActionState, NotifyAccountOperatorUsersInfo> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.usersInfo,
);

const selectReviewDecisionNotification: StateSelector<RequestActionState, DecisionNotification> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewDecisionNotification);

const selectOfficialNoticeFile: StateSelector<RequestActionState, AttachedFile> = createAggregateSelector(
  timelineCommonQuery.selectDownloadUrl,
  selectPayload,
  (downloadUrl, payload) => {
    return {
      downloadUrl: timelineUtils.getOfficialNoticeUrl(downloadUrl, payload?.officialNotice?.uuid),
      fileName: payload?.officialNotice?.name,
    };
  },
);

export const notificationDecisionQuery = {
  selectPayload,
  selectReviewDecision,
  selectUsersInfo,
  selectReviewDecisionNotification,
  selectOfficialNoticeFile,
};
