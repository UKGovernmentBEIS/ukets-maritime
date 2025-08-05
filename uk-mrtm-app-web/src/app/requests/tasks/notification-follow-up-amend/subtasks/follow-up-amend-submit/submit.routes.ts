import { Routes } from '@angular/router';

import { canActivateConfirmComponent } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/submit.guard';

export const SUBMIT_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateConfirmComponent],
    loadComponent: () =>
      import(
        '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/follow-up-amend-submit-confirm'
      ).then((c) => c.FollowUpAmendSubmitConfirmComponent),
  },
  {
    path: 'success',
    title: 'Response sent to regulator',
    loadComponent: () =>
      import(
        '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit/follow-up-amend-submit-success'
      ).then((c) => c.FollowUpAmendSubmitSuccessComponent),
  },
];
