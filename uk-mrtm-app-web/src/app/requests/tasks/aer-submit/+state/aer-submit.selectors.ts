import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';

const selectPayload: StateSelector<RequestTaskState, AerSubmitTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectVerificationPerformed: StateSelector<RequestTaskState, AerSubmitTaskPayload['verificationPerformed']> =
  createDescendingSelector(selectPayload, (payload) => payload?.verificationPerformed);

const selectVerificationBodyId: StateSelector<RequestTaskState, AerSubmitTaskPayload['verificationBodyId']> =
  createDescendingSelector(selectPayload, (payload) => payload?.verificationBodyId);

const selectShouldSubmitToRegulator: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  aerCommonQuery.selectReportingRequired,
  selectVerificationPerformed,
  (reportingRequired, verificationPerformed) => reportingRequired === false || verificationPerformed === true,
);

export const aerSubmitQuery = {
  selectPayload,
  selectVerificationPerformed,
  selectVerificationBodyId,
  selectShouldSubmitToRegulator,
};
