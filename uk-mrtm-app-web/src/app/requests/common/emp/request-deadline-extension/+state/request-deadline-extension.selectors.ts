import { RdePayload } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { EmpRdeTaskPayload } from '@requests/common/emp/request-deadline-extension/request-deadline-extension.types';

const selectPayload: StateSelector<EmpRdeTaskPayload, EmpRdeTaskPayload> = createSelector<
  EmpRdeTaskPayload,
  EmpRdeTaskPayload
>((payload) => payload);

const selectRde: StateSelector<EmpRdeTaskPayload, RdePayload> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.rdePayload,
);

export const rdeQuery = {
  selectPayload,
  selectRde,
};
