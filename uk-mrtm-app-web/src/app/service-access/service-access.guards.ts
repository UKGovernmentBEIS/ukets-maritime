import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { map } from 'rxjs';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { AuthService } from '@core/services/auth.service';

// canMatch runs during route recognition, before the canActivate guards of the
// parent route have populated the auth state on a full page load — so the user
// must be resolved here before the role can be read.
export function roleCanMatch(...roleTypes: UserStateDTO['roleType'][]): CanMatchFn {
  return () => {
    const authService = inject(AuthService);
    const authStore = inject(AuthStore);

    return authService.checkUser().pipe(map(() => roleTypes.includes(authStore.select(selectUserRoleType)())));
  };
}
