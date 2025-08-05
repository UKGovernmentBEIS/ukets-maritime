import { RdeResponsePayload } from '@mrtm/api';

import { createDescendingSelector, requestTaskQuery, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpRdeDetailsPayload } from '@requests/common/emp/request-deadline-extension/request-deadline-extension.types';

const selectResponseDetails: StateSelector<RequestTaskState, RdeResponsePayload> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpRdeDetailsPayload>(),
  (payload) => payload?.rdeResponsePayload,
);

const selectIsRegulatorTask: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskType,
  (taskType) => taskType === 'EMP_ISSUANCE_WAIT_FOR_RDE_RESPONSE' || taskType === 'EMP_VARIATION_WAIT_FOR_RDE_RESPONSE',
);

const selectRdeAttachments: StateSelector<RequestTaskState, EmpRdeDetailsPayload['rdeAttachments']> =
  createDescendingSelector(empCommonQuery.selectPayload<EmpRdeDetailsPayload>(), (payload) => payload?.rdeAttachments);

export const rdeDetailsQuery = {
  selectResponseDetails,
  selectRdeAttachments,
  selectIsRegulatorTask,
};
