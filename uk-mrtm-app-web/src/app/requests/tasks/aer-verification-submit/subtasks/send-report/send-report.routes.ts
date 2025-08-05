import { Routes } from '@angular/router';

export const SEND_REPORT_ROUTES: Routes = [
  {
    path: '',
    title: 'Send report to operator',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/send-report/send-report-confirmation').then(
        (c) => c.SendReportConfirmationComponent,
      ),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/send-report/send-report-success').then(
        (c) => c.SendReportSuccessComponent,
      ),
  },
];
