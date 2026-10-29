import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RedirectCommand, Router } from '@angular/router';

import { first, map } from 'rxjs';

import { AuthStore, selectIsLoggedIn } from '@netz/common/auth';

const keepsUrlOnSignIn = (route: ActivatedRouteSnapshot): boolean =>
  !!route.data?.keepUrlOnSignIn || route.children.some(keepsUrlOnSignIn);

export const loggedInGuard: CanActivateFn = (_, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return store.rxSelect(selectIsLoggedIn).pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        const landingUrl = router.parseUrl('landing');

        // Keep the requested url in the browser, so that the user returns to it after signing in
        return state?.root && keepsUrlOnSignIn(state.root)
          ? new RedirectCommand(landingUrl, { skipLocationChange: true })
          : landingUrl;
      }

      return true;
    }),
    first(),
  );
};
