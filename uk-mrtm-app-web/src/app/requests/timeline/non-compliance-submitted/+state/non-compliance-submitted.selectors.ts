import { createDescendingSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { NonComplianceDetailsSummary, NonComplianceSubmittedTimelinePayload } from '@requests/common/non-compliance';

const selectPayload: StateSelector<RequestActionState, NonComplianceSubmittedTimelinePayload> =
  timelineCommonQuery.selectPayload<NonComplianceSubmittedTimelinePayload>();

const selectNonComplianceDetailsSummary: StateSelector<RequestActionState, NonComplianceDetailsSummary> =
  createDescendingSelector(selectPayload, (payload) => ({
    reason: payload?.reason,
    nonComplianceDate: payload?.nonComplianceDate,
    complianceDate: payload?.complianceDate,
    comments: payload?.comments,
    civilPenalty: payload?.civilPenalty,
    noCivilPenaltyJustification: payload?.noCivilPenaltyJustification,
    noticeOfIntent: payload?.noticeOfIntent,
    initialPenalty: payload?.initialPenalty,
    selectedRequestsMapped: payload?.selectedRequests,
  }));

export const nonComplianceSubmittedQuery = {
  selectPayload,
  selectNonComplianceDetailsSummary,
};
