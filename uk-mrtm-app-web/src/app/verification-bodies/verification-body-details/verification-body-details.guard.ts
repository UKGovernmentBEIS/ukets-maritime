import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { combineLatest, map } from 'rxjs';

import { VerificationBodiesStoreService } from '@verification-bodies/+state/verification-bodies-store.service';

export const verificationBodyDetailsGuard: CanActivateFn = (route) => {
  const verificationBodiesStore: VerificationBodiesStoreService = inject(VerificationBodiesStoreService);

  const verificationBodyId = Number(route.paramMap.get('id'));

  return combineLatest([
    verificationBodiesStore.loadVerificationBody(verificationBodyId),
    verificationBodiesStore.loadVerifierUsers(verificationBodyId),
  ]).pipe(map(([verificationBodies, verifierUsers]) => verificationBodies && verifierUsers));
};
