import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';
import { isNil } from 'lodash-es';

import { UserAuthorityStore } from '@accounts/store';
import { selectIsInitiallySubmitted } from '@accounts/store/user-authority.selectors';

export const createOperatorUserSummaryGuard: CanActivateFn = (route) => {
  const store = inject(UserAuthorityStore);
  const router = inject(Router);

  const { accountId, userType } = route.params;

  return store.pipe(
    selectIsInitiallySubmitted,
    map(
      (isInitiallySubmitted) =>
        isInitiallySubmitted ||
        (!isNil(accountId) && !isNil(userType)
          ? router.parseUrl(`/accounts/${accountId}/users/add/${userType}`)
          : router.parseUrl('/accounts')),
    ),
  );
};
