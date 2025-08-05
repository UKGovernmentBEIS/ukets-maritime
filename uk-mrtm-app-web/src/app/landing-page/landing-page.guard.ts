import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { AuthStore, selectIsLoggedIn, selectUserState, selectUserTerms } from '@netz/common/auth';

import { ConfigStore, selectIsFeatureEnabled } from '@core/config';
import { AuthService } from '@core/services/auth.service';
import { LatestTermsStore } from '@core/store/latest-terms/latest-terms.store';
import { hasNoAuthority, shouldShowAccepted, shouldShowDisabled } from '@core/util/user-status-util';
import { environment } from '@environments/environment';

export const landingPageGuard: () => Observable<boolean | UrlTree> = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const configStore = inject(ConfigStore);
  const latestTermsStore = inject(LatestTermsStore);
  const authService = inject(AuthService);

  const authSrc$ = combineLatest([
    authStore.rxSelect(selectIsLoggedIn),
    authStore.rxSelect(selectUserState),
    authStore.rxSelect(selectUserTerms),
  ]);

  return authService.checkUser().pipe(
    switchMap(() =>
      combineLatest([
        authSrc$,
        configStore.pipe(selectIsFeatureEnabled('terms')),
        configStore.pipe(selectIsFeatureEnabled('serviceGatewayEnabled')),
        latestTermsStore,
      ]),
    ),
    map(([[isLoggedIn, userState, userTerms], termsFeatureEnabled, serviceGatewayEnabled, latestTerms]) => {
      if (!isLoggedIn) {
        if (!environment.production || !serviceGatewayEnabled) {
          return true; // show app's landing page
        }

        // otherwise redirect to gateway's landing page
        const url = new URL(location.origin);

        url.searchParams.set(
          'appRedirectPath',
          /(\/registration|\/2fa|\/forgot-password|\/error)($|\/)/.test(location.href)
            ? authService.baseRedirectUri
            : location.href,
        );
        window.location.href = url.toString();
        return false;
      }

      if (!userState.roleType) {
        return true;
      }

      if (termsFeatureEnabled && latestTerms.version !== userTerms.termsVersion) {
        return router.parseUrl('terms');
      }

      if (['REGULATOR', 'VERIFIER'].includes(userState.roleType) && hasNoAuthority(userState)) {
        return router.parseUrl('dashboard');
      }

      if (
        shouldShowDisabled(userState) ||
        hasNoAuthority(userState) ||
        router.getCurrentNavigation()?.extras?.state?.addAnotherInstallation ||
        shouldShowAccepted(userState)
      ) {
        return true;
      }

      return router.parseUrl('dashboard');
    }),
    first(),
  );
};
