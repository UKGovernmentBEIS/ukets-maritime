import { DoeApplicationSubmittedRequestActionPayload, DoeMaritimeEmissions } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { AttachedFile, OfficialNoticeInfo } from '@shared/types';

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(
    timelineCommonQuery.selectDownloadUrl,
    timelineCommonQuery.selectPayload<DoeApplicationSubmittedRequestActionPayload>(),
    (downloadUrl: string, payload) =>
      files?.map((id) => ({ downloadUrl: `${downloadUrl}${id}`, fileName: payload?.doeAttachments[id] })),
  );

const selectMaritimeEmissions: StateSelector<RequestActionState, DoeMaritimeEmissions> = createDescendingSelector(
  timelineCommonQuery.selectPayload<DoeApplicationSubmittedRequestActionPayload>(),
  (payload) => payload?.doe?.maritimeEmissions,
);

const selectOfficialNoticeInfo: StateSelector<RequestActionState, OfficialNoticeInfo> = createAggregateSelector(
  timelineCommonQuery.selectPayload<DoeApplicationSubmittedRequestActionPayload>(),
  timelineCommonQuery.selectDownloadUrl,
  (payload, downloadUrl) =>
    timelineUtils.getOfficialNoticeInfo(
      payload?.usersInfo,
      payload?.decisionNotification?.signatory,
      payload?.officialNotice,
      downloadUrl,
    ),
);

export const doeSubmittedQuery = {
  selectAttachedFiles,
  selectMaritimeEmissions,
  selectOfficialNoticeInfo,
};
