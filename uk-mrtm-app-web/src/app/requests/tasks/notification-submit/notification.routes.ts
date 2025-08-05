import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  provideNotificationMutators,
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskService,
} from '@requests/tasks/notification-submit/notification.providers';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideNotificationMutators(),
      provideNotificationSideEffects(),
      provideNotificationStepFlowManagers(),
      provideNotificationTaskService(),
    ],
    children: [
      {
        path: 'details-change',
        loadChildren: () =>
          import('@requests/tasks/notification-submit/subtasks/details-change').then((r) => r.DETAILS_CHANGE_ROUTES),
      },
      {
        path: 'submit',
        loadChildren: () =>
          import('@requests/tasks/notification-submit/subtasks/submit-notification-to-regulator').then(
            (r) => r.SUBMIT_NOTIFICATION_TO_REGULATOR_ROUTES,
          ),
      },
    ],
  },
];
