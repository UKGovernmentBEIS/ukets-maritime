import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { selectDecision, timelineCommonQuery } from '@requests/common';
import { EmpPeerReviewDecisionTaskPayload } from '@requests/timeline/emp-peer-review-decision/emp-peer-review-decision.types';
import { EmpPeerReviewDecisionDto } from '@shared/types';

const selectPeerReviewDecision: StateSelector<RequestActionState, EmpPeerReviewDecisionTaskPayload['decision']> =
  createDescendingSelector(
    timelineCommonQuery.selectPayload<EmpPeerReviewDecisionTaskPayload>(),
    (payload) => payload.decision,
  );

const selectPeerReviewDecisionDto: StateSelector<RequestActionState, EmpPeerReviewDecisionDto> =
  createAggregateSelector(requestActionQuery.selectSubmitter, selectPeerReviewDecision, (submitter, decision) => ({
    ...decision,
    submitter,
  }));

export const empPeerReviewDecisionQuery = {
  selectDecision,
  selectPeerReviewDecisionDto,
};
