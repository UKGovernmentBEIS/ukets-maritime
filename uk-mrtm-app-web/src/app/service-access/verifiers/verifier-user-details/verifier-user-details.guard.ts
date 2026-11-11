import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';

export const verifierUserDetailsGuard: CanActivateFn = (route) => {
  const store: VerifierUserStore = inject(VerifierUserStore);
  return store.loadVerifierUserById(route.paramMap.get('userId'));
};
