import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { DoeSubtasks } from '@requests/common/doe';
import { canActivatePeerReviewDecision } from '@requests/tasks/doe-peer-review/doe-peer-review.guard';
import {
  peerReviewDecisionProviders,
  provideDoePeerReviewPayloadMutators,
  provideDoePeerReviewStepFlowManagers,
  provideDoePeerReviewTaskServices,
} from '@requests/tasks/doe-peer-review/doe-peer-review.providers';

export const DOE_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideDoePeerReviewPayloadMutators(),
      provideDoePeerReviewTaskServices(),
      provideDoePeerReviewStepFlowManagers(),
    ],
    children: [
      {
        path: DoeSubtasks.MaritimeEmissions,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/doe-peer-review/subtasks/maritime-emissions').then(
            (c) => c.MaritimeEmissionsSummaryComponent,
          ),
      },
      {
        path: 'review-decision',
        providers: [peerReviewDecisionProviders],
        canActivate: [canActivatePeerReviewDecision],
        loadChildren: () =>
          import('@requests/common/subtasks/peer-review-decision').then((r) => r.PEER_REVIEW_DECISION_ROUTES),
      },
    ],
  },
];
