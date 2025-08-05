import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common/task-navigation';
import {
  canActivateDetailsChangeStep,
  canActivateDetailsChangeSummary,
} from '@requests/tasks/notification-submit/subtasks/details-change/details-change.guard';
import { DetailsChangeWizardStep } from '@requests/tasks/notification-submit/subtasks/details-change/details-change.helper';

export const DETAILS_CHANGE_ROUTES: Routes = [
  {
    path: '',
    title: 'Details of the change',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateDetailsChangeSummary],
    loadComponent: () =>
      import('@requests/tasks/notification-submit/subtasks/details-change/summary').then((m) => m.SummaryComponent),
  },
  {
    path: DetailsChangeWizardStep.NON_SIGNIFICANT_CHANGE,
    canActivate: [canActivateDetailsChangeStep],
    title: 'Details of the change',
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(DetailsChangeWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/notification-submit/subtasks/details-change/non-significant-change').then(
        (m) => m.NonSignificantChangeComponent,
      ),
  },
];
