import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { first, map, switchMap } from 'rxjs';

import { OperatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore, selectUserState } from '@netz/common/auth';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';

import { saveNotFoundOperatorError } from '@accounts/errors';

export const deleteUserAuthorityGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const usersService = inject(UsersService);
  const operatorUsersService = inject(OperatorUsersService);
  const businessErrorService = inject(BusinessErrorService);

  const accountId = Number(route.paramMap.get('accountId'));
  const routeUserId = route.paramMap.get('userId');

  return authStore.rxSelect(selectUserState).pipe(
    first(),
    switchMap(({ userId }) => {
      return userId === routeUserId
        ? usersService.getCurrentUser()
        : operatorUsersService.getOperatorUserById(accountId, routeUserId);
    }),
    map((res) => !!res),
    catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
      businessErrorService.showError(saveNotFoundOperatorError(Number(route.paramMap.get('accountId')))),
    ),
  );
};
