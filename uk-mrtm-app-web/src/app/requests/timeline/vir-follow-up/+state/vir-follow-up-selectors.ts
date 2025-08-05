import { OperatorImprovementResponse } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { VirFollowUpActionPayload } from '@requests/timeline/vir-follow-up/vir-follow-up.types';
import { AttachedFile } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, VirFollowUpActionPayload> = createDescendingSelector(
  requestActionQuery.selectActionPayload,
  (payload) => payload as VirFollowUpActionPayload,
);

const selectVirAttachments: StateSelector<RequestActionState, Record<string, string>> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.virAttachments,
);

const selectReference: StateSelector<RequestActionState, string> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.verifierComment?.reference,
);

const selectOperatorResponseSummaryData: StateSelector<
  RequestActionState,
  Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] }
> = createAggregateSelector(
  selectPayload,
  timelineCommonQuery.selectDownloadUrl,
  selectVirAttachments,
  (payload, downloadUrl, attachments) => {
    const { files, ...rest } = payload?.operatorImprovementResponse ?? {};

    return {
      ...rest,
      files:
        files?.map((id) => ({
          downloadUrl: downloadUrl + id,
          fileName: attachments?.[id],
        })) ?? [],
    } as Omit<OperatorImprovementResponse, 'files'> & { files?: AttachedFile[] };
  },
);

export const virFollowUpQuery = {
  selectPayload,
  selectReference,
  selectOperatorResponseSummaryData,
};
