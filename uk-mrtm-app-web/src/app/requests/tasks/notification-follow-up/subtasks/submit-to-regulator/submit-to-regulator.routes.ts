import { Routes } from '@angular/router';

import { canActivateConfirmComponent } from '@requests/tasks/notification-follow-up/subtasks/submit-to-regulator/submit-to-regulator.guard';

export const SUBMIT_TO_REGULATOR_ROUTES: Routes = [
  {
    path: '',
    title: 'Submit to regulator',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateConfirmComponent],
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up/subtasks/submit-to-regulator/submit-to-regulator-confirm').then(
        (c) => c.SubmitToRegulatorConfirmComponent,
      ),
  },
  {
    path: 'success',
    title: 'Response sent to regulator',
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up/subtasks/submit-to-regulator/submit-to-regulator-success').then(
        (c) => c.SubmitToRegulatorSuccessComponent,
      ),
  },
];
