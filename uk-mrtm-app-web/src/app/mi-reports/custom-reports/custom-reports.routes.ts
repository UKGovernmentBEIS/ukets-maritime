import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { resolveCustomReportData } from '@mi-reports/custom-reports/create-custom-report/create-custom-report.resolver';
import { MiReportFormMode } from '@mi-reports/custom-reports/custom-reports.constants';
import { canManageCustomReportsGuard } from '@mi-reports/custom-reports/custom-reports.guard';

export const CUSTOM_REPORTS_ROUTES: Routes = [
  {
    path: MiReportFormMode.ADD,
    title: 'Add a custom report',
    canActivate: [canManageCustomReportsGuard],
    data: { breadcrumb: false, backlink: '../../', formMode: MiReportFormMode.ADD },
    loadComponent: () =>
      import('@mi-reports/custom-reports/create-custom-report').then((c) => c.CreateCustomReportComponent),
  },
  {
    path: ':id',
    // Re-fetch the report when navigating between its child pages, e.g. back to the preview after saving an edit
    runGuardsAndResolvers: 'always',
    resolve: {
      customReport: resolveCustomReportData,
    },
    children: [
      {
        path: '',
        title: (route: ActivatedRouteSnapshot) => route.data?.customReport?.reportName,
        loadComponent: () =>
          import('@mi-reports/custom-reports/custom-reports-preview').then((c) => c.CustomReportsPreviewComponent),
      },
      {
        path: MiReportFormMode.EDIT,
        title: 'Edit report',
        canActivate: [canManageCustomReportsGuard],
        data: { breadcrumb: false, backlink: '../', formMode: MiReportFormMode.EDIT },
        loadComponent: () =>
          import('@mi-reports/custom-reports/create-custom-report').then((c) => c.CreateCustomReportComponent),
      },
      {
        path: MiReportFormMode.DELETE,
        title: 'Delete report',
        canActivate: [canManageCustomReportsGuard],
        data: { breadcrumb: false, backlink: '../', formMode: MiReportFormMode.DELETE },
        loadComponent: () =>
          import('@mi-reports/custom-reports/custom-reports-delete').then((c) => c.CustomReportsDeleteComponent),
      },
      {
        path: 'history',
        title: 'Report history',
        data: { breadcrumb: true },
        loadComponent: () =>
          import('@mi-reports/custom-reports/custom-reports-history').then((c) => c.CustomReportsHistoryComponent),
      },
    ],
  },
];
