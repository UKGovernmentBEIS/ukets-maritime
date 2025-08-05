import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';

export const addGuard: CanActivateFn = () => {
  const store = inject(VerifierUserStore);
  store.resetCreateUserAuthority();
  return true;
};
