import { Routes } from '@angular/router';

import { SkipReviewWizardSteps } from '@requests/tasks/aer-review/subtasks/skip-review/skip-review.constants';

export const SKIP_REVIEW_ROUTES: Routes = [
  {
    path: '',
    title: 'Skip review and complete report',
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-review/subtasks/skip-review/skip-review-form').then((c) => c.SkipReviewFormComponent),
  },
  {
    path: SkipReviewWizardSteps.SUCCESS,
    title: 'Emissions report completed',
    data: { breadcrumb: true },
    loadComponent: () =>
      import('@requests/tasks/aer-review/components/complete-review-success').then(
        (c) => c.CompleteReviewSuccessComponent,
      ),
  },
];
