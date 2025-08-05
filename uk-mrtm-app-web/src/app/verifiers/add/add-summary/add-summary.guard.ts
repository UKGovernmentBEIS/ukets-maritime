import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { selectIsInitiallySubmitted } from '@verifiers/+state/verifier-user.selectors';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';

export const addSummaryGuard: CanActivateFn = (route) => {
  const store = inject(VerifierUserStore);
  const router = inject(Router);

  return store.pipe(selectIsInitiallySubmitted).pipe(
    map(
      (success) =>
        success ||
        router.createUrlTree(['/user/verifiers/add/', route.paramMap.get('userType')], {
          queryParams: route.queryParams,
        }),
    ),
  );
};
