import { Routes } from '@angular/router';

export const SUBMIT_NOTIFICATION_TO_REGULATOR_ROUTES: Routes = [
  {
    path: '',
    title: 'Submit to regulator',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import(
        '@requests/tasks/notification-submit/subtasks/submit-notification-to-regulator/submit-notification-to-regulator-confirm'
      ).then((c) => c.SubmitNotificationToRegulatorConfirmComponent),
  },
  {
    path: 'success',
    title: 'Notification sent to regulator',
    loadComponent: () =>
      import(
        '@requests/tasks/notification-submit/subtasks/submit-notification-to-regulator/submit-notification-to-regulator-success'
      ).then((c) => c.SubmitNotificationToRegulatorSuccessComponent),
  },
];
