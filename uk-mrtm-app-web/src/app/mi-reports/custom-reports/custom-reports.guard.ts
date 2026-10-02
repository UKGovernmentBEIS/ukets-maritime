import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { CustomReportsPermissionsService } from '@mi-reports/custom-reports/custom-reports-permissions.service';

export const canManageCustomReportsGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(CustomReportsPermissionsService)
    .canManageCustomReports()
    .pipe(map((canManage) => canManage || router.createUrlTree(['/mi-reports'])));
};

export const clearCustomReportsPermissionsGuard: CanDeactivateFn<unknown> = () => {
  inject(CustomReportsPermissionsService).clear();

  return true;
};
