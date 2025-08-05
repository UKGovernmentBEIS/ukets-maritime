import { VirApplicationReviewedRequestActionPayload } from '@mrtm/api';

import { createDescendingSelector, requestActionQuery, RequestActionState, StateSelector } from '@netz/common/store';

const selectPayload: StateSelector<RequestActionState, VirApplicationReviewedRequestActionPayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (payload) => payload as VirApplicationReviewedRequestActionPayload,
  );

export const virReviewedQuery = {
  selectPayload,
};
