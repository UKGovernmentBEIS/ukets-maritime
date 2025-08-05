import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  provideFollowUpAmendPayloadMutators,
  provideFollowUpAmendSideEffects,
  provideFollowUpAmendStepFlowManagers,
  provideFollowUpAmendTaskServices,
} from '@requests/tasks/notification-follow-up-amend/follow-up-amend.providers';
import { followUpAmendMap } from '@requests/tasks/notification-follow-up-amend/subtasks/subtask-list.map';

export const FOLLOW_UP_AMEND_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideFollowUpAmendPayloadMutators(),
      SideEffectsHandler,
      provideFollowUpAmendSideEffects(),
      provideFollowUpAmendTaskServices(),
      provideFollowUpAmendStepFlowManagers(),
    ],
    children: [
      {
        path: 'details',
        title: followUpAmendMap.amendsDetails.title,
        data: {
          breadcrumb: false,
          backlink: '../../',
        },
        loadComponent: () =>
          import('./subtasks/amends-details/amends-details.component').then((c) => c.AmendsDetailsComponent),
      },
      {
        path: 'response',
        data: { breadcrumb: false },
        title: followUpAmendMap.followUpResponse.title,
        loadChildren: () =>
          import('./subtasks/follow-up-response/response.routes').then((r) => r.FOLLOW_UP_RESPONSE_ROUTES),
      },
      {
        path: 'submit',
        data: { breadcrumb: false },
        title: followUpAmendMap.submitToRegulator.title,
        loadChildren: () =>
          import('@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/submit.routes').then(
            (r) => r.SUBMIT_ROUTES,
          ),
      },
    ],
  },
];
