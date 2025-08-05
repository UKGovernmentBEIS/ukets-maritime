import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const canDeactivateCreateVerificationBodyGuard: CanDeactivateFn<unknown> = (): boolean => {
  const store: VerificationBodiesStoreService = inject(VerificationBodiesStoreService);
  store.resetCreateVerificationBody();
  return true;
};
