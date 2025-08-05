import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  provideFollowUpPayloadMutators,
  provideFollowUpSideEffects,
  provideFollowUpStepFlowManagers,
  provideFollowUpTaskServices,
} from '@requests/tasks/notification-follow-up/follow-up.providers';
import { respondToFollowUpMap } from '@requests/tasks/notification-follow-up/subtasks/subtask-list.map';

export const FOLLOW_UP_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideFollowUpPayloadMutators(),
      provideFollowUpTaskServices(),
      provideFollowUpStepFlowManagers(),
      provideFollowUpSideEffects(),
    ],
    title: respondToFollowUpMap.title,
    data: { breadcrumb: false },
    children: [
      {
        path: 'response',
        data: { breadcrumb: false },
        title: respondToFollowUpMap.followUpResponse.title,
        loadChildren: () =>
          import('@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.routes').then(
            (r) => r.FOLLOW_UP_RESPONSE_ROUTES,
          ),
      },
      {
        path: 'submit',
        data: { breadcrumb: false },
        title: respondToFollowUpMap.submitToRegulator.title,
        loadChildren: () =>
          import('@requests/tasks/notification-follow-up/subtasks/submit-to-regulator/submit-to-regulator.routes').then(
            (r) => r.SUBMIT_TO_REGULATOR_ROUTES,
          ),
      },
    ],
  },
];
