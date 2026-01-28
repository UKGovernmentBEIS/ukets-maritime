import { Routes } from '@angular/router';

export const SEND_FOR_PEER_REVIEW_PATH = 'peer-review';

export const SEND_FOR_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    title: 'Send for peer review',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () => import('@requests/common/components').then((c) => c.SendForPeerReviewComponent),
  },
  {
    path: 'success',
    title: 'Sent for peer review',
    loadComponent: () =>
      import('@requests/common/components/peer-review/send-for-peer-review-success').then(
        (c) => c.SendForPeerReviewSuccessComponent,
      ),
  },
];
