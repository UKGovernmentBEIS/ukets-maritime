import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';
import { isNil } from 'lodash-es';

import { UserAuthorityStore } from '@accounts/store';
import { selectIsSubmitted } from '@accounts/store/user-authority.selectors';

export const createOperatorUserSuccessGuard: CanActivateFn = (route) => {
  const store = inject(UserAuthorityStore);
  const router = inject(Router);

  const { accountId, userType } = route.params;

  return store.pipe(
    selectIsSubmitted,
    map(
      (isSubmitted) =>
        isSubmitted ||
        (!isNil(accountId) && !isNil(userType)
          ? router.parseUrl(`/accounts/${accountId}/users/add/${userType}`)
          : router.parseUrl('/accounts')),
    ),
  );
};
