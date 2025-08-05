import { Routes } from '@angular/router';

import { DetailsChangeWizardStep } from '@requests/tasks/notification-peer-review/subtasks/details-change';
import { detailsChangeMap } from '@requests/tasks/notification-peer-review/subtasks/subtask-list.map';

export const PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'decision',
        loadChildren: () =>
          import('@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision.routes').then(
            (r) => r.PEER_REVIEW_DECISION_ROUTES,
          ),
      },
      {
        path: DetailsChangeWizardStep.DETAILS_CHANGE,
        title: detailsChangeMap.title,
        data: {
          breadcrumb: false,
          backlink: '../../',
        },
        loadComponent: () =>
          import('@requests/tasks/notification-peer-review/subtasks/details-change/details-change.component').then(
            (c) => c.DetailsChangeComponent,
          ),
      },
    ],
  },
];
