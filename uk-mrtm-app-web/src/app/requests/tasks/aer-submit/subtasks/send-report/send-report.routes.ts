import { Routes } from '@angular/router';

export const SEND_REPORT_ROUTES: Routes = [
  {
    path: '',
    title: 'Send report',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/tasks/aer-submit/subtasks/send-report/send-report').then((c) => c.SendReportComponent),
  },
  {
    path: 'success',
    title: 'Send report',
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('@requests/tasks/aer-submit/subtasks/send-report/send-report-success-message').then(
        (c) => c.SendReportSuccessMessageComponent,
      ),
  },
];
