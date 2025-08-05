import { Routes } from '@angular/router';

import {
  canActivateFollowUpResponseStep,
  canActivateFollowUpResponseSummary,
} from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.guard';
import { FollowUpResponseWizardStep } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';
import { followUpResponseBacklinkResolver } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response-backlink.resolver';

export const FOLLOW_UP_RESPONSE_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false },
    resolve: { backlink: followUpResponseBacklinkResolver(FollowUpResponseWizardStep.SUMMARY) },
    canActivate: [canActivateFollowUpResponseSummary],
    loadComponent: () =>
      import(
        '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response-summary/follow-up-response-summary.component'
      ).then((c) => c.FollowUpResponseSummaryComponent),
  },
  {
    path: FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE,
    data: { breadcrumb: false },
    resolve: { backlink: followUpResponseBacklinkResolver(FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE) },
    canActivate: [canActivateFollowUpResponseStep],
    loadComponent: () =>
      import(
        '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response/follow-up-response.component'
      ).then((c) => c.FollowUpResponseComponent),
  },
];
