import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot, Router } from '@angular/router';

export const deleteShipsGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  return router.getCurrentNavigation()?.extras?.state?.ships?.length > 0
    ? true
    : createUrlTreeFromSnapshot(route, ['../']);
};
