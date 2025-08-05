import { createSelector, StateSelector } from '@netz/common/store';

import { ReturnToOperatorForChangesState } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state/return-to-operator-for-changes.state';

export const selectChangesRequired: StateSelector<ReturnToOperatorForChangesState, string> = createSelector(
  (state) => state.changesRequired,
);

export const selectIsSubmitted: StateSelector<ReturnToOperatorForChangesState, boolean> = createSelector(
  (state) => state.isSubmitted,
);

export const returnToOperatorForChangesQuery = {
  selectChangesRequired,
  selectIsSubmitted,
};
