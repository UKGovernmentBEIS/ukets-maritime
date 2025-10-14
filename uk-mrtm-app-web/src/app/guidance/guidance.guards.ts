import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, Router } from '@angular/router';

import { catchError, of, take } from 'rxjs';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { GuidanceService } from '@guidance/services';

export const canActivateGuidance: CanActivateFn = () => {
  const service = inject(GuidanceService);
  const router = inject(Router);

  return service.loadGuidanceSections().pipe(
    take(1),
    catchError((err) => {
      console.error(err);

      return of(router.createUrlTree(['dashboard']));
    }),
  );
};

export const canActivateManageGuidance: CanActivateFn = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
  const store = inject(GuidanceStore);
  store.resetManageGuidanceState();
  return store.select(guidanceQuery.selectIsEditable)() || createUrlTreeFromSnapshot(activatedRouteSnapshot, ['../']);
};
