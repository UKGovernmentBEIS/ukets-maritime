import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { PeerReviewStore } from '@requests/tasks/notification-peer-review/+state/peer-review.store';
import { peerReviewDecisionQuery } from '@requests/tasks/notification-peer-review/+state/peer-review-decision.selectors';

export const canActivatePeerReviewDecision: CanActivateFn = (route) => {
  const store = inject(PeerReviewStore);

  return (
    !store.select(peerReviewDecisionQuery.selectIsDecisionSubmitted)() || createUrlTreeFromSnapshot(route, ['success'])
  );
};

export const canActivatePeerReviewDecisionSummary: CanActivateFn = (route) => {
  const store = inject(PeerReviewStore);
  const decision = store.select(peerReviewDecisionQuery.selectDecision)();
  return (
    (decision.accepted !== null &&
      decision.accepted !== undefined &&
      !!decision.notes &&
      !store.select(peerReviewDecisionQuery.selectIsDecisionSubmitted)()) ||
    (store.select(peerReviewDecisionQuery.selectIsDecisionSubmitted)() &&
      createUrlTreeFromSnapshot(route, ['../success'])) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};

export const canActivatePeerReviewDecisionSuccess: CanActivateFn = (route) => {
  const store = inject(PeerReviewStore);
  return store.select(peerReviewDecisionQuery.selectIsDecisionSubmitted)() || createUrlTreeFromSnapshot(route, ['../']);
};
