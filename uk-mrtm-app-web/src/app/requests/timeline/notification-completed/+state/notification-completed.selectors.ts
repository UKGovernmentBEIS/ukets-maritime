import {
  DecisionNotification,
  EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload,
} from '@mrtm/api';

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
  EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload
> = timelineCommonQuery.selectPayload<EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload>();

const selectReviewDecision: StateSelector<RequestActionState, NotificationReviewDecisionUnion> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewDecision as NotificationReviewDecisionUnion);

const selectUsersInfo: StateSelector<RequestActionState, NotifyAccountOperatorUsersInfo> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.usersInfo,
);

const selectDueDate: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.responseExpirationDate,
);

const selectSubmissionDate: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.responseSubmissionDate,
);

const selectReviewDecisionNotification: StateSelector<RequestActionState, DecisionNotification> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewDecisionNotification);

const selectSignatory: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectReviewDecisionNotification,
  (decision) => decision?.signatory,
);

const selectRequest: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.request,
);

const selectResponse: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.response,
);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(timelineCommonQuery.selectDownloadUrl, selectPayload, (downloadUrl, payload) =>
    timelineUtils.getAttachedFiles(files, payload?.responseAttachments, downloadUrl),
  );

const selectResponseFiles: StateSelector<RequestActionState, string[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.responseFiles,
);

export const notificationCompletedQuery = {
  selectPayload,
  selectReviewDecision,
  selectUsersInfo,
  selectDueDate,
  selectSubmissionDate,
  selectSignatory,
  selectRequest,
  selectResponse,
  selectAttachedFiles,
  selectResponseFiles,
};
