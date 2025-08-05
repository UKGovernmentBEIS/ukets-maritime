import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { switchMap } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';

export const verifiersGuard: CanActivateFn = () => {
  const authStore: AuthStore = inject(AuthStore);
  const store: VerifierUserStore = inject(VerifierUserStore);
  const router: Router = inject(Router);

  return authStore.rxSelect(selectUserRoleType).pipe(
    switchMap((role) => {
      if (role !== 'VERIFIER') {
        return router.navigate(['/dashboard']);
      }

      return store.loadVerifierUsers();
    }),
  );
};
