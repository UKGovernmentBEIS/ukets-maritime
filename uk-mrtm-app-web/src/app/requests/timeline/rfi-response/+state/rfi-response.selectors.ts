import { RfiResponseSubmittedRequestActionPayload } from '@mrtm/api';

import { createAggregateSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { RfiResponse } from '@shared/types';

const selectRfiResponseData: StateSelector<RequestActionState, RfiResponse> = createAggregateSelector(
  timelineCommonQuery.selectPayload<RfiResponseSubmittedRequestActionPayload>(),
  timelineCommonQuery.selectDownloadUrl,
  (payload, downloadUrl) => ({
    questions: payload?.rfiQuestionPayload?.questions ?? [],
    answers: payload?.rfiResponsePayload?.answers ?? [],
    operatorFiles: timelineUtils.getAttachedFiles(
      payload?.rfiResponsePayload?.files,
      payload?.rfiAttachments,
      downloadUrl,
      true,
    ),
    regulatorFiles: timelineUtils.getAttachedFiles(
      payload?.rfiQuestionPayload?.files,
      payload?.rfiAttachments,
      downloadUrl,
      true,
    ),
  }),
);

export const rfiResponseQuery = {
  selectRfiResponseData,
};
