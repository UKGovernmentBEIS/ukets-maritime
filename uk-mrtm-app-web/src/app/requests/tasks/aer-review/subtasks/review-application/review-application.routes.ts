import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { AER_REVIEW_TASK_TITLE, AerReviewWizardSteps } from '@requests/tasks/aer-review/aer-review.constants';
import { canActivateReviewApplication } from '@requests/tasks/aer-review/subtasks/review-application/review-application.guard';

export const REVIEW_APPLICATION_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../../' },
    title: 'Check your answers',
    canActivate: [canActivateReviewApplication],
    loadComponent: () =>
      import('@requests/tasks/aer-review/subtasks/review-application/review-application-summary').then(
        (c) => c.ReviewApplicationSummaryComponent,
      ),
  },
  {
    path: AerReviewWizardSteps.FORM,
    title: () => inject(AER_REVIEW_TASK_TITLE),
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AerReviewWizardSteps.SUMMARY, '../../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-review/subtasks/review-application/review-application-form').then(
        (c) => c.ReviewApplicationFormComponent,
      ),
  },
];
