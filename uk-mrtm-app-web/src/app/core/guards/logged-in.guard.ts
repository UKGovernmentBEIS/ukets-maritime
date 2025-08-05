import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { first, map } from 'rxjs';

import { AuthStore, selectIsLoggedIn } from '@netz/common/auth';

export const loggedInGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return store.rxSelect(selectIsLoggedIn).pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return router.parseUrl('landing');
      }

      return true;
    }),
    first(),
  );
};
