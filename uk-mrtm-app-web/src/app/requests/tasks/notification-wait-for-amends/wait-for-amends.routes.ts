import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { waitForAmendsMap } from '@requests/tasks/notification-wait-for-amends/subtask-list.map';
import { canActivateEditDueDate } from '@requests/tasks/notification-wait-for-amends/subtasks/edit-due-date/edit-due-date.guard';
import {
  provideWaitForAmendsPayloadMutators,
  provideWaitForAmendsStepFlowManagers,
  provideWaitForAmendsTaskServices,
} from '@requests/tasks/notification-wait-for-amends/wait-for-amends.providers';

export const WAIT_FOR_AMENDS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideWaitForAmendsTaskServices(),
      provideWaitForAmendsStepFlowManagers(),
      provideWaitForAmendsPayloadMutators(),
    ],
    children: [
      {
        path: 'edit-due-date',
        title: waitForAmendsMap.editDueDate.title,
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
