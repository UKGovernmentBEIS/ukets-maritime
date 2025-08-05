import { EmpIssuanceDetermination } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { EmpReviewedTaskPayload } from '@requests/timeline/emp-reviewed/emp-reviewed.types';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { EmpReviewedDto } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpReviewedTaskPayload> =
  timelineCommonQuery.selectPayload<EmpReviewedTaskPayload>();

const selectDecision: StateSelector<RequestActionState, EmpIssuanceDetermination['type']> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.determination?.type,
);

const selectReviewDTO: StateSelector<RequestActionState, EmpReviewedDto> = createAggregateSelector(
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
      empFile: payload?.empDocument
        ? [
            {
              fileName: payload?.empDocument?.name,
              downloadUrl: `${downloadUrl}document/${payload?.empDocument?.uuid}`,
            },
          ]
        : [],
      officialNotice: officialNoticeInfo.officialNotice,
      users: officialNoticeInfo.users,
      signatory: officialNoticeInfo.signatory,
      empApplication: {
        title: taskActionTypeToTitleMap[action?.requestType] ?? action?.requestType,
        url: `/accounts/${action?.requestAccountId}/workflows/${action?.requestId}/timeline/${action?.id}/emp-reviewed`,
      },
    };
  },
);

export const empReviewedQuery = {
  selectPayload,
  selectDecision,
  selectReviewDTO,
};
