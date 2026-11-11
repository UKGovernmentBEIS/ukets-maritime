import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { selectIsInitiallySubmitted } from '@service-access/verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';

export const verifierUserAddSummaryGuard: CanActivateFn = (route) => {
  const store = inject(VerifierUserStore);
  const router = inject(Router);

  return store.pipe(selectIsInitiallySubmitted).pipe(
    map(
      (success) =>
        success ||
        router.createUrlTree(['/service-access/verifier-users/add/', route.paramMap.get('userType')], {
          queryParams: route.queryParams,
        }),
    ),
  );
};
