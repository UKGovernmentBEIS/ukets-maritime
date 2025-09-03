import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import {
  returnToOperatorForChangesQuery,
  ReturnToOperatorForChangesStore,
} from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state';

export const canActivateReturnToOperatorForChangesForm: CanActivateFn = (route) => {
  const store = inject(ReturnToOperatorForChangesStore);

  return (
    !store.select(returnToOperatorForChangesQuery.selectIsSubmitted)() || createUrlTreeFromSnapshot(route, ['success'])
  );
};

export const canActivateReturnToOperatorForChangesSummary: CanActivateFn = (route) => {
  const store = inject(ReturnToOperatorForChangesStore);
  const changesRequired = store.select(returnToOperatorForChangesQuery.selectChangesRequired)();
  const isSubmitted = store.select(returnToOperatorForChangesQuery.selectIsSubmitted)();
  return (
    (!!changesRequired && !isSubmitted) ||
    (isSubmitted && createUrlTreeFromSnapshot(route, ['../success'])) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivateReturnToOperatorForChangesSuccess: CanActivateFn = (route) => {
  const store = inject(ReturnToOperatorForChangesStore);
  return store.select(returnToOperatorForChangesQuery.selectIsSubmitted)() || createUrlTreeFromSnapshot(route, ['../']);
};

export const canActivateReturnToOperatorForChanges: CanActivateFn = () => {
  const store = inject(ReturnToOperatorForChangesStore);
  store.reset();

  return true;
};
