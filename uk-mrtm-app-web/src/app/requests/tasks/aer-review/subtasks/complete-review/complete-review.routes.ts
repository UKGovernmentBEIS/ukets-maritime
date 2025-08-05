import { Routes } from '@angular/router';

export const SUBMIT_REVIEW_ROUTES: Routes = [
  {
    path: '',
    title: 'Complete emissions report',
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-review/subtasks/complete-review/complete-review-confirmation').then(
        (c) => c.CompleteReviewConfirmationComponent,
      ),
  },
  {
    path: 'success',
    title: 'Emissions report completed',
    data: { breadcrumb: true },
    loadComponent: () =>
      import('@requests/tasks/aer-review/components/complete-review-success').then(
        (c) => c.CompleteReviewSuccessComponent,
      ),
  },
];
