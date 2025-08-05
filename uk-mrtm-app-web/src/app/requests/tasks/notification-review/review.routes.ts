import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  provideReviewPayloadMutators,
  provideReviewSideEffects,
  provideReviewStepFlowManagers,
  provideReviewTaskServices,
} from '@requests/tasks/notification-review/review.providers';

export const REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideReviewPayloadMutators(),
      SideEffectsHandler,
      provideReviewSideEffects(),
      provideReviewTaskServices(),
      provideReviewStepFlowManagers(),
    ],
    children: [
      {
        path: 'details-change',
        loadChildren: () => import('./subtasks/details-change').then((r) => r.DETAILS_CHANGE_ROUTES),
      },
      {
        path: 'notify-operator',
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: 'peer-review',
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((c) => c.SEND_FOR_PEER_REVIEW_ROUTES),
      },
    ],
  },
];
