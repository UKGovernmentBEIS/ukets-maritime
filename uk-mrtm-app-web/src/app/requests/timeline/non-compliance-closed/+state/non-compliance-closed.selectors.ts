import { NonComplianceApplicationClosedRequestActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, NonComplianceApplicationClosedRequestActionPayload> =
  timelineCommonQuery.selectPayload<NonComplianceApplicationClosedRequestActionPayload>();

const selectNonComplianceAttachments: StateSelector<
  RequestActionState,
  NonComplianceApplicationClosedRequestActionPayload['nonComplianceAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.nonComplianceAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(
    timelineCommonQuery.selectDownloadUrl,
    selectNonComplianceAttachments,
    (downloadUrl, attachments) =>
      files?.map((id) => ({ downloadUrl: downloadUrl + id, fileName: attachments?.[id] })) ?? [],
  );

const selectReason: StateSelector<RequestActionState, NonComplianceApplicationClosedRequestActionPayload['reason']> =
  createDescendingSelector(selectPayload, (payload) => payload?.reason);

const selectFiles: StateSelector<RequestActionState, NonComplianceApplicationClosedRequestActionPayload['files']> =
  createDescendingSelector(selectPayload, (payload) => payload?.files);

export const nonComplianceClosedQuery = {
  selectPayload,
  selectAttachedFiles,
  selectReason,
  selectFiles,
};
