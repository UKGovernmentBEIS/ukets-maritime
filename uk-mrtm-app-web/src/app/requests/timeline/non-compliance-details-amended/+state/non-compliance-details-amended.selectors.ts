import { NonComplianceAmendDetailsRequestTaskActionPayload } from '@mrtm/api';

import { createDescendingSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { NonComplianceDetailsBase } from '@requests/common/non-compliance';

const selectPayload: StateSelector<RequestActionState, NonComplianceAmendDetailsRequestTaskActionPayload> =
  timelineCommonQuery.selectPayload<NonComplianceAmendDetailsRequestTaskActionPayload>();

const selectNonComplianceDetailsBase: StateSelector<RequestActionState, NonComplianceDetailsBase> =
  createDescendingSelector(selectPayload, (payload) => ({
    reason: payload?.reason,
    nonComplianceDate: payload?.nonComplianceDate,
    complianceDate: payload?.complianceDate,
    nonComplianceComments: payload?.nonComplianceComments,
  }));

export const nonComplianceDetailsAmendedQuery = {
  selectPayload,
  selectNonComplianceDetailsBase,
};
