import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  canActivateFollowUpResponseStep,
  canActivateFollowUpResponseSummary,
} from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.guard';
import { ResponseWizardStep } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';

export const FOLLOW_UP_RESPONSE_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateFollowUpResponseSummary],
    loadComponent: () =>
      import('./response-summary/response-summary.component').then((c) => c.ResponseSummaryComponent),
  },
  {
    path: ResponseWizardStep.FOLLOW_UP_RESPONSE,
    data: { breadcrumb: false },
    resolve: { backlink: backlinkResolver(ResponseWizardStep.SUMMARY, '../../') },
    canActivate: [canActivateFollowUpResponseStep],
    loadComponent: () => import('./response/response.component').then((c) => c.ResponseComponent),
  },
];
