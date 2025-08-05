import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { selectIsSubmitted } from '@verification-bodies/+state/verification-bodies.selectors';
import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const canActivateSuccessGuard: CanActivateFn = () => {
  const store = inject(VerificationBodiesStoreService);
  const router = inject(Router);

  return store.pipe(
    selectIsSubmitted,
    map((isSubmitted) => isSubmitted || router.parseUrl('/verification-bodies/add')),
  );
};
