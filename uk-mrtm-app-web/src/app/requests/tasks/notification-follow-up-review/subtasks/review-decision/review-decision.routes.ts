import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common/task-navigation';
import {
  canActivateReviewDecisionStep,
  canActivateReviewDecisionSummary,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision/review-decision.guard';
import { ReviewDecisionWizardStep } from '@requests/tasks/notification-follow-up-review/subtasks/review-decision/review-decision.helper';
import { followUpReviewDecisionMap } from '@requests/tasks/notification-follow-up-review/subtasks/subtask-list.map';

export const DETAILS_CHANGE_ROUTES: Routes = [
  {
    path: '',
    title: followUpReviewDecisionMap.title,
    data: {
      breadcrumb: false,
      backlink: '../../',
    },
    canActivate: [canActivateReviewDecisionSummary],
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up-review/subtasks/review-decision').then(
        (c) => c.ReviewDecisionSummaryComponent,
      ),
  },
  {
    path: ReviewDecisionWizardStep.REVIEW_DECISION_QUESTION,
    data: {
      breadcrumb: false,
    },
    resolve: {
      backlink: backlinkResolver(ReviewDecisionWizardStep.SUMMARY, '../../'),
    },
    title: followUpReviewDecisionMap.reviewDecisionQuestion.title,
    canActivate: [canActivateReviewDecisionStep],
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up-review/subtasks/review-decision').then(
        (c) => c.ReviewDecisionQuestionComponent,
      ),
  },
];
