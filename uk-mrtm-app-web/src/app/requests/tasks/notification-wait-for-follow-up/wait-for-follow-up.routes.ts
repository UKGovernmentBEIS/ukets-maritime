import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { waitForFollowUpMap } from '@requests/tasks/notification-wait-for-follow-up/subtask-list.map';
import { canActivateEditDueDate } from '@requests/tasks/notification-wait-for-follow-up/subtasks/edit-due-date/edit-due-date.guard';
import {
  provideWaitForFollowUpPayloadMutators,
  provideWaitForFollowUpStepFlowManagers,
  provideWaitForFollowUpTaskServices,
} from '@requests/tasks/notification-wait-for-follow-up/wait-for-follow-up.providers';

export const WAIT_FOR_FOLLOW_UP_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideWaitForFollowUpTaskServices(),
      provideWaitForFollowUpStepFlowManagers(),
      provideWaitForFollowUpPayloadMutators(),
    ],
    children: [
      {
        path: 'edit-due-date',
        title: waitForFollowUpMap.editDueDate.title,
        data: {
          breadcrumb: false,
          backlink: '../../',
        },
        canActivate: [canActivateEditDueDate],
        loadComponent: () =>
          import('./subtasks/edit-due-date/edit-due-date.component').then((c) => c.EditDueDateComponent),
      },
    ],
  },
];
