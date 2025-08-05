import { RfiSubmitPayload } from '@mrtm/api';

import { createDescendingSelector, createSelector, StateSelector } from '@netz/common/store';

import { EmpRfiTaskPayload } from '@requests/common/emp/request-for-information/request-for-information.types';

const selectPayload: StateSelector<EmpRfiTaskPayload, EmpRfiTaskPayload> = createSelector<
  EmpRfiTaskPayload,
  EmpRfiTaskPayload
>((payload) => payload);

const selectRfi: StateSelector<EmpRfiTaskPayload, RfiSubmitPayload> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.rfiSubmitPayload,
);

export const rfiQuery = {
  selectPayload,
  selectRfi,
};
