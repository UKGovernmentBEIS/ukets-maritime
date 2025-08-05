import { createAggregateSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { EmpVariationRegulatorApprovedActionPayload } from '@requests/timeline/emp-variation-regulator-approved/emp-variation-regulator-approved.types';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { EmpReviewedDto } from '@shared/types';

const selectEmpApprovedDTO: StateSelector<RequestActionState, EmpReviewedDto> = createAggregateSelector(
  timelineCommonQuery.selectPayload<EmpVariationRegulatorApprovedActionPayload>(),
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
      determination: {
        type: 'APPROVED',
      },
      empFile: payload?.empDocument
        ? [
            {
              fileName: payload?.empDocument?.name,
              downloadUrl: `${downloadUrl}/document/${payload?.empDocument?.uuid}`,
            },
          ]
        : [],
      users: officialNoticeInfo.users,
      signatory: officialNoticeInfo.signatory,
      officialNotice: officialNoticeInfo.officialNotice,
      empApplication: {
        title: taskActionTypeToTitleMap[action?.requestType] ?? action?.requestType,
        url: `/accounts/${action?.requestAccountId}/workflows/${action?.requestId}/timeline/${action?.id}/emp-variation-reg-reviewed`,
      },
    };
  },
);

export const empVariationRegulatorApprovedQuery = {
  selectEmpApprovedDTO,
};
