import { RdeSubmittedRequestActionPayload } from '@mrtm/api';

import { createAggregateSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { RdeSubmitted } from '@shared/types';

const selectRdeData: StateSelector<RequestActionState, RdeSubmitted> = createAggregateSelector(
  timelineCommonQuery.selectPayload<RdeSubmittedRequestActionPayload>(),
  timelineCommonQuery.selectDownloadUrl,
  (payload, downloadUrl) => {
    const officialNoticeInfo = timelineUtils.getOfficialNoticeInfo(
      payload?.usersInfo,
      payload?.rdePayload?.signatory,
      payload?.officialDocument,
      downloadUrl,
    );
    return {
      operators: officialNoticeInfo.users,
      signatory: officialNoticeInfo.signatory?.name,
      officialNotice: officialNoticeInfo.officialNotice,
      deadline: payload?.rdePayload?.deadline,
      extensionDate: payload?.rdePayload?.extensionDate,
    };
  },
);

export const rdeSubmittedQuery = {
  selectRdeData,
};
