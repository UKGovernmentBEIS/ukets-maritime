import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { map } from 'rxjs';

import { AuthService } from '@core/services';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export const canRedirectToSignIn: CanActivateFn = () => {
  const authService = inject(AuthService);

  return fromPromise(authService.login({ redirectUri: authService.baseRedirectUri })).pipe(map(() => true));
};
