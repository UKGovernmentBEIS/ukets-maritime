import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { first, Observable, switchMap } from 'rxjs';

import { AuthorityManagePermissionDTO, RegulatorAuthoritiesService } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';

import { viewNotFoundRegulatorError } from '@regulators/errors/business-error';

export const permissionsResolver: (route: ActivatedRouteSnapshot) => Observable<AuthorityManagePermissionDTO> = (
  route,
) => {
  const authStore = inject(AuthStore);
  const regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  const businessErrorService = inject(BusinessErrorService);

  return authStore.rxSelect(selectUserId).pipe(
    first(),
    switchMap((userId) =>
      userId === route.paramMap.get('userId')
        ? regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa()
        : regulatorAuthoritiesService.getRegulatorUserPermissionsByCaAndId(route.paramMap.get('userId')),
    ),
    catchBadRequest(ErrorCodes.AUTHORITY1003, () => businessErrorService.showError(viewNotFoundRegulatorError)),
  );
};
