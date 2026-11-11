import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { selectIsInitiallySubmitted } from '@service-access/verification-bodies/+state/verification-bodies.selectors';
import { VerificationBodiesStoreService } from '@service-access/verification-bodies/+state/verification-bodies-store.service';

export const canActivateSummaryGuard: CanActivateFn = () => {
  const store = inject(VerificationBodiesStoreService);
  const router = inject(Router);

  return store.pipe(
    selectIsInitiallySubmitted,
    map((isInitiallySubmitted) => isInitiallySubmitted || router.parseUrl('/service-access/verification-bodies/add')),
  );
};
