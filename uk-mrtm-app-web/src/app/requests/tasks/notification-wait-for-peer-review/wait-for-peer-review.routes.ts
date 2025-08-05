import { Routes } from '@angular/router';

import { waitForPeerReviewMap } from '@requests/tasks/notification-wait-for-peer-review/subtask-list.map';

export const WAIT_FOR_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'details-change',
        title: waitForPeerReviewMap.detailsOfChange.title,
        data: {
          breadcrumb: false,
          backlink: '../../',
        },
        loadComponent: () =>
          import('./subtasks/wait-for-peer-review-summary').then((c) => c.WaitForPeerReviewSummaryComponent),
      },
    ],
  },
];
