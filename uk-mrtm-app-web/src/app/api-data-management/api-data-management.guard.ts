import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

export const canActivateApiDataManagement: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.select(selectUserRoleType)() === 'OPERATOR' || router.createUrlTree(['/dashboard']);
};
