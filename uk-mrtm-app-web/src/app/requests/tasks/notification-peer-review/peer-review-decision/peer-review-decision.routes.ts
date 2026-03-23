import { Routes } from '@angular/router';

import {
  canActivatePeerReviewDecision,
  canActivatePeerReviewDecisionSuccess,
  canActivatePeerReviewDecisionSummary,
} from '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision.guard';

export const PEER_REVIEW_DECISION_ROUTES: Routes = [
  {
    path: '',
    title: 'Peer review decision',
    canActivate: [canActivatePeerReviewDecision],
    data: {
      breadcrumb: false,
      backlink: '../../',
    },
    loadComponent: () =>
      import(
        '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision/peer-review-decision.component'
      ).then((c) => c.PeerReviewDecisionComponent),
  },
  {
    path: 'summary',
    title: 'Peer review decision summary',
    canActivate: [canActivatePeerReviewDecisionSummary],
    data: {
      breadcrumb: false,
      backlink: '../../../',
    },
    loadComponent: () =>
      import(
        '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision-summary/peer-review-decision-summary.component'
      ).then((c) => c.PeerReviewDecisionSummaryComponent),
  },
  {
    path: 'success',
    title: 'Returned to regulator',
    canActivate: [canActivatePeerReviewDecisionSuccess],
    loadComponent: () =>
      import(
        '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision-success/peer-review-decision-success.component'
      ).then((c) => c.PeerReviewDecisionSuccessComponent),
  },
];
