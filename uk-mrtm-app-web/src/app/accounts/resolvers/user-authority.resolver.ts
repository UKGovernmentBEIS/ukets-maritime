import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { first, Observable, switchMap } from 'rxjs';

import { OperatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore, selectUserState } from '@netz/common/auth';

import { UserAuthorityDTO } from '@accounts/types/user-authority.type';

export const userAuthorityResolver: ResolveFn<Observable<UserAuthorityDTO>> = (route) => {
  const authStore = inject(AuthStore);
  const usersService = inject(UsersService);
  const operatorUsersService = inject(OperatorUsersService);
  const accountId = Number(route.paramMap.get('accountId'));
  const routeUserId = route.paramMap.get('userId');
  return authStore.rxSelect(selectUserState).pipe(
    first(),
    switchMap(({ userId }) =>
      userId === routeUserId
        ? usersService.getCurrentUser()
        : operatorUsersService.getOperatorUserById(accountId, routeUserId),
    ),
  );
};
