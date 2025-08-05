import { AccountClosureSubmittedRequestActionPayload } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { AccountClosureDto } from '@shared/types';

const selectReason: StateSelector<RequestActionState, string> = createDescendingSelector(
  timelineCommonQuery.selectPayload<AccountClosureSubmittedRequestActionPayload>(),
  (payload) => payload.accountClosure?.reason,
);

const selectAccountClosureDto: StateSelector<RequestActionState, AccountClosureDto> = createAggregateSelector(
  requestActionQuery.selectSubmitter,
  requestActionQuery.selectAction,
  selectReason,
  (submitter, action, reason) => ({
    submitter,
    reason,
    closureDate: action?.creationDate,
  }),
);

export const accountClosureSubmittedQuery = {
  selectAccountClosureDto,
};
