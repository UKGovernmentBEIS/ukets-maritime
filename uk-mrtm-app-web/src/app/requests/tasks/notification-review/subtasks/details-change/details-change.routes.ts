import { Routes } from '@angular/router';

import {
  canActivateDetailsChangeStep,
  canActivateDetailsChangeSummary,
} from '@requests/tasks/notification-review/subtasks/details-change/details-change.guard';
import { DetailsChangeWizardStep } from '@requests/tasks/notification-review/subtasks/details-change/details-change.helper';
import { detailsChangeMap } from '@requests/tasks/notification-review/subtasks/subtask-list.map';

export const DETAILS_CHANGE_ROUTES: Routes = [
  {
    path: '',
    title: detailsChangeMap.title,
    data: {
      breadcrumb: false,
      backlink: '../../',
    },
    canActivate: [canActivateDetailsChangeSummary],
    loadComponent: () =>
      import('@requests/tasks/notification-review/subtasks/details-change').then(
        (c) => c.DetailsChangeSummaryComponent,
      ),
  },
  {
    path: DetailsChangeWizardStep.REVIEW_DECISION,
    title: detailsChangeMap.reviewDecision.title,
    data: {
      breadcrumb: false,
      backlink: '../../../',
    },
    canActivate: [canActivateDetailsChangeStep],
    loadComponent: () =>
      import('@requests/tasks/notification-review/subtasks/details-change').then(
        (c) => c.DetailsChangeDecisionComponent,
      ),
  },
];
