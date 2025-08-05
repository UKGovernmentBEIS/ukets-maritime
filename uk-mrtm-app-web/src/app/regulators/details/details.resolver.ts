import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { first, Observable, switchMap } from 'rxjs';

import { RegulatorCurrentUserDTO, RegulatorUserDTO, RegulatorUsersService, UsersService } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';

import { viewNotFoundRegulatorError } from '@regulators/errors/business-error';

export const detailsResolver: (
  route: ActivatedRouteSnapshot,
) => Observable<RegulatorUserDTO | RegulatorCurrentUserDTO> = (route) => {
  const authStore = inject(AuthStore);
  const usersService = inject(UsersService);
  const regulatorUsersService = inject(RegulatorUsersService);
  const businessErrorService = inject(BusinessErrorService);

  return authStore.rxSelect(selectUserId).pipe(
    first(),
    switchMap((userId) =>
      userId === route.paramMap.get('userId')
        ? usersService.getCurrentUser()
        : regulatorUsersService.getRegulatorUserByCaAndId(route.paramMap.get('userId')),
    ),
    catchBadRequest(ErrorCodes.AUTHORITY1003, () => businessErrorService.showError(viewNotFoundRegulatorError)),
  );
};
