import { RequestActionUserInfo } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import {
  NonComplianceNoticeOfIntentTimelinePayload,
  NonComplianceNoticeOfIntentUpload,
} from '@requests/common/non-compliance';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, NonComplianceNoticeOfIntentTimelinePayload> =
  timelineCommonQuery.selectPayload<NonComplianceNoticeOfIntentTimelinePayload>();

const selectNonComplianceNoticeOfIntentUpload: StateSelector<RequestActionState, NonComplianceNoticeOfIntentUpload> =
  createDescendingSelector(selectPayload, (payload) => ({
    noticeOfIntent: payload?.noticeOfIntent,
    comments: payload?.comments,
    nonComplianceAttachments: payload?.nonComplianceAttachments,
  }));

const selectNonComplianceAttachments: StateSelector<
  RequestActionState,
  NonComplianceNoticeOfIntentTimelinePayload['nonComplianceAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.nonComplianceAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(
    timelineCommonQuery.selectDownloadUrl,
    selectNonComplianceAttachments,
    (downloadUrl, attachments) =>
      files?.map((id) => ({ downloadUrl: downloadUrl + id, fileName: attachments?.[id] })) ?? [],
  );

const selectNotifiedUsersInfo: StateSelector<RequestActionState, { [key: string]: RequestActionUserInfo }> =
  createDescendingSelector(selectPayload, (payload) => payload?.usersInfo);

export const nonComplianceNoticeOfIntentSubmittedQuery = {
  selectPayload,
  selectNonComplianceNoticeOfIntentUpload,
  selectAttachedFiles,
  selectNotifiedUsersInfo,
};
