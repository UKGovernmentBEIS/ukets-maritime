import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { canActivateNotifyOperator } from '@requests/tasks/notification-follow-up-review/follow-up-review.guard';
import {
  provideFollowUpReviewPayloadMutators,
  provideFollowUpReviewSideEffects,
  provideFollowUpReviewStepFlowManagers,
  provideFollowUpReviewTaskServices,
} from '@requests/tasks/notification-follow-up-review/follow-up-review.providers';

export const FOLLOW_UP_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideFollowUpReviewPayloadMutators(),
      SideEffectsHandler,
      provideFollowUpReviewSideEffects(),
      provideFollowUpReviewTaskServices(),
      provideFollowUpReviewStepFlowManagers(),
    ],
    children: [
      {
        path: 'review-decision',
        loadChildren: () => import('./subtasks/review-decision').then((r) => r.DETAILS_CHANGE_ROUTES),
      },
      {
        path: 'return-for-amends',
        loadChildren: () =>
          import('@requests/tasks/notification-follow-up-review/return-for-amends').then(
            (r) => r.RETURN_FOR_AMENDS_ROUTES,
          ),
      },
      {
        path: 'notify-operator',
        canActivate: [canActivateNotifyOperator],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
    ],
  },
];
