import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  canActivateFollowUpResponseStep,
  canActivateFollowUpResponseSummary,
} from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.guard';
import { ResponseWizardStep } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { followUpAmendMap } from '@requests/tasks/notification-follow-up-amend/subtasks/subtask-list.map';

export const FOLLOW_UP_RESPONSE_ROUTES: Routes = [
  {
    path: '',
    title: followUpAmendMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateFollowUpResponseSummary],
    loadComponent: () =>
      import('./response-summary/response-summary.component').then((c) => c.ResponseSummaryComponent),
  },
  {
    path: ResponseWizardStep.FOLLOW_UP_RESPONSE,
    title: followUpAmendMap.followUpResponse.title,
    data: { breadcrumb: false },
    resolve: { backlink: backlinkResolver(ResponseWizardStep.SUMMARY, '../../') },
    canActivate: [canActivateFollowUpResponseStep],
    loadComponent: () => import('./response/response.component').then((c) => c.ResponseComponent),
  },
];
