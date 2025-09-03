import { NonComplianceFinalDetermination } from '@mrtm/api';

import { createDescendingSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { NonComplianceFinalDeterminationSubmittedTimelinePayload } from '@requests/common/non-compliance';

const selectPayload: StateSelector<RequestActionState, NonComplianceFinalDeterminationSubmittedTimelinePayload> =
  timelineCommonQuery.selectPayload<NonComplianceFinalDeterminationSubmittedTimelinePayload>();

const selectNonComplianceFinalDetermination: StateSelector<RequestActionState, NonComplianceFinalDetermination> =
  createDescendingSelector(selectPayload, (payload) => ({
    complianceRestored: payload.complianceRestored,
    complianceRestoredDate: payload.complianceRestoredDate,
    comments: payload.comments,
    reissuePenalty: payload.reissuePenalty,
    operatorPaid: payload.operatorPaid,
    operatorPaidDate: payload.operatorPaidDate,
  }));

export const nonComplianceFinalDeterminationSubmittedQuery = {
  selectPayload,
  selectNonComplianceFinalDetermination,
};
