import { RequestActionUserInfo } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import {
  NonComplianceCivilPenaltyTimelinePayload,
  NonComplianceCivilPenaltyUpload,
} from '@requests/common/non-compliance';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, NonComplianceCivilPenaltyTimelinePayload> =
  timelineCommonQuery.selectPayload<NonComplianceCivilPenaltyTimelinePayload>();

const selectNonComplianceCivilPenaltyUpload: StateSelector<RequestActionState, NonComplianceCivilPenaltyUpload> =
  createDescendingSelector(selectPayload, (payload) => ({
    civilPenalty: payload?.civilPenalty,
    comments: payload?.comments,
    dueDate: payload?.dueDate,
    penaltyAmount: payload?.penaltyAmount,
    nonComplianceAttachments: payload?.nonComplianceAttachments,
  }));

const selectNonComplianceAttachments: StateSelector<
  RequestActionState,
  NonComplianceCivilPenaltyTimelinePayload['nonComplianceAttachments']
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

export const nonComplianceCivilPenaltySubmittedQuery = {
  selectPayload,
  selectNonComplianceCivilPenaltyUpload,
  selectAttachedFiles,
  selectNotifiedUsersInfo,
};
