import { Routes } from '@angular/router';

export const SEND_REPORT_ROUTES: Routes = [
  {
    path: ':key',
    children: [
      {
        path: '',
        title: 'Send report',
        data: { backlink: '../../../', breadcrumb: false },
        loadComponent: () =>
          import('@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report/send-report').then(
            (c) => c.SendReportComponent,
          ),
      },
      {
        path: 'success',
        title: 'Report sent',
        data: { backlink: false, breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report/send-report-success').then(
            (c) => c.SendReportSuccessComponent,
          ),
      },
    ],
  },
];
