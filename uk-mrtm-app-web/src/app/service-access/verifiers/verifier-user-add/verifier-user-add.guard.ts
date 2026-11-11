import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';

export const verifierUserAddGuard: CanActivateFn = () => {
  const store = inject(VerifierUserStore);
  store.resetCreateUserAuthority();
  return true;
};
