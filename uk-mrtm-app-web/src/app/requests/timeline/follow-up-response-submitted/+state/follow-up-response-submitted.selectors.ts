import { EmpNotificationFollowUpResponseSubmittedRequestActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpNotificationFollowUpResponseSubmittedRequestActionPayload> =
  timelineCommonQuery.selectPayload<EmpNotificationFollowUpResponseSubmittedRequestActionPayload>();

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(timelineCommonQuery.selectDownloadUrl, selectPayload, (downloadUrl, payload) =>
    timelineUtils.getAttachedFiles(files, payload?.responseAttachments, downloadUrl),
  );

const selectResponseFiles: StateSelector<RequestActionState, string[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.responseFiles,
);

export const followUpResponseSubmittedQuery = {
  selectPayload,
  selectAttachedFiles,
  selectResponseFiles,
};
