import { RequestActionUserInfo } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import {
  NonComplianceInitialPenaltyNoticeTimelinePayload,
  NonComplianceInitialPenaltyNoticeUpload,
} from '@requests/common/non-compliance';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, NonComplianceInitialPenaltyNoticeTimelinePayload> =
  timelineCommonQuery.selectPayload<NonComplianceInitialPenaltyNoticeTimelinePayload>();

const selectNonComplianceInitialPenaltyNoticeUpload: StateSelector<
  RequestActionState,
  NonComplianceInitialPenaltyNoticeUpload
> = createDescendingSelector(selectPayload, (payload) => ({
  initialPenaltyNotice: payload?.initialPenaltyNotice,
  comments: payload?.comments,
  nonComplianceAttachments: payload?.nonComplianceAttachments,
}));

const selectNonComplianceAttachments: StateSelector<
  RequestActionState,
  NonComplianceInitialPenaltyNoticeTimelinePayload['nonComplianceAttachments']
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

export const nonComplianceInitialPenaltyNoticeSubmittedQuery = {
  selectPayload,
  selectNonComplianceInitialPenaltyNoticeUpload,
  selectAttachedFiles,
  selectNotifiedUsersInfo,
};
