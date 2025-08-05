import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { map, of, switchMap } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const verificationBodiesGuard: CanActivateFn = () => {
  const authStore: AuthStore = inject(AuthStore);
  const store: VerificationBodiesStoreService = inject(VerificationBodiesStoreService);

  return authStore.rxSelect(selectUserRoleType).pipe(
    map((userRole) => userRole === 'REGULATOR'),
    switchMap((val) => (val ? store.loadVerificationBodies() : of(val))),
  );
};
