import { RfiSubmittedRequestActionPayload } from '@mrtm/api';

import { createAggregateSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { RfiSubmitted } from '@shared/types';

const selectRfiSubmittedData: StateSelector<RequestActionState, RfiSubmitted> = createAggregateSelector(
  timelineCommonQuery.selectPayload<RfiSubmittedRequestActionPayload>(),
  timelineCommonQuery.selectDownloadUrl,
  (payload, downloadUrl) => {
    const officialNoticeInfo = timelineUtils.getOfficialNoticeInfo(
      payload?.usersInfo,
      payload?.rfiSubmitPayload?.signatory,
      payload?.officialDocument,
      downloadUrl,
    );
    return {
      operators: officialNoticeInfo.users,
      signatory: officialNoticeInfo.signatory?.name,
      officialNotice: officialNoticeInfo.officialNotice,
      deadline: payload?.rfiSubmitPayload?.deadline,
      questions: payload?.rfiSubmitPayload?.questions ?? [],
      attachments: Object.entries(payload?.rfiAttachments ?? {}).map(([key, value]) => ({
        fileName: value,
        downloadUrl: `${downloadUrl}attachment/${key}`,
      })),
    };
  },
);

export const rfiSubmittedQuery = {
  selectRfiSubmittedData,
};
