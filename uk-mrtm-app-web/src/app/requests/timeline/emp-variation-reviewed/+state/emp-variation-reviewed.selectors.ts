import { EmpVariationDetermination } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { EmpVariationReviewedTaskPayload } from '@requests/timeline/emp-variation-reviewed/emp-variation-reviewed.types';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { EmpVariationReviewedDto } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpVariationReviewedTaskPayload> =
  timelineCommonQuery.selectPayload<EmpVariationReviewedTaskPayload>();

const selectDecision: StateSelector<RequestActionState, EmpVariationDetermination['type']> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.determination?.type,
);

const selectReviewDTO: StateSelector<RequestActionState, EmpVariationReviewedDto> = createAggregateSelector(
  selectPayload,
  timelineCommonQuery.selectDownloadUrl,
  requestActionQuery.selectAction,
  (payload, downloadUrl, action) => {
    const officialNoticeInfo = timelineUtils.getOfficialNoticeInfo(
      payload?.usersInfo,
      payload?.decisionNotification?.signatory,
      payload?.officialNotice,
      downloadUrl,
    );
    return {
      determination: payload?.determination,
      empFile: payload?.['empDocument']
        ? [
            {
              fileName: payload?.['empDocument']?.name,
              downloadUrl: `${downloadUrl}document/${payload?.['empDocument']?.uuid}`,
            },
          ]
        : [],
      users: officialNoticeInfo.users,
      signatory: officialNoticeInfo.signatory,
      officialNotice: officialNoticeInfo.officialNotice,
      empApplication: {
        title: taskActionTypeToTitleMap[action?.requestType] ?? action?.requestType,
        url: `/accounts/${action?.requestAccountId}/workflows/${action?.requestId}/timeline/${action.id}/emp-variation-reviewed`,
      },
    };
  },
);

export const empVariationReviewedQuery = {
  selectDecision,
  selectReviewDTO,
};
