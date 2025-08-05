import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';

export const detailsGuard: CanActivateFn = (route) => {
  const store: VerifierUserStore = inject(VerifierUserStore);
  return store.loadVerifierUserById(route.paramMap.get('userId'));
};
