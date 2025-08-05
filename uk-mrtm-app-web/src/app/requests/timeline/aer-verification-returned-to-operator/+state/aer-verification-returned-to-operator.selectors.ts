import { AerVerificationReturnToOperatorRequestTaskActionPayload } from '@mrtm/api';

import { createDescendingSelector, RequestActionState, StateSelector } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';

const selectChangesRequired: StateSelector<
  RequestActionState,
  AerVerificationReturnToOperatorRequestTaskActionPayload['changesRequired']
> = createDescendingSelector(
  timelineCommonQuery.selectPayload<AerVerificationReturnToOperatorRequestTaskActionPayload>(),
  (payload) => payload.changesRequired,
);

export const aerVerificationReturnedToOperatorQuery = {
  selectChangesRequired,
};
