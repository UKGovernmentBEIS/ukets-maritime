import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { UserAuthorityStore } from '@accounts/store';

export const createOperatorUserGuard: CanDeactivateFn<unknown> = () => {
  const store = inject(UserAuthorityStore);
  store.resetCreateUserAuthority();
  return true;
};
