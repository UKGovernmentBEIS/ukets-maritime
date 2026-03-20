import { Routes } from '@angular/router';

import { miReportTypeDescriptionMap } from '@mi-reports/core/mi-report';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportsListGuard } from '@mi-reports/core/mi-reports-list.guard';
import { miReportUseCaseMap } from '@mi-reports/use-cases';

export const MI_REPORTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [MiReportsListGuard],
    resolve: { miReports: MiReportsListGuard },
    children: [
      {
        path: '',
        title: 'MI reports',
        loadComponent: () => import('@mi-reports/mi-reports.component').then((c) => c.MiReportsComponent),
      },
      {
        path: 'custom',
        title: miReportTypeDescriptionMap[MiReportType.CUSTOM],
        data: { breadcrumb: miReportTypeDescriptionMap[MiReportType.CUSTOM] },
        loadComponent: () => import('@mi-reports/custom').then((c) => c.CustomReportComponent),
      },
      {
        path: 'accounts-users-contacts',
        title: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
        data: {
          breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
        },
        providers: miReportUseCaseMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
        loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
      },
      {
        path: 'assigned-regulator-site-contacts',
        title: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS],
        data: {
          breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS],
        },
        providers: miReportUseCaseMap[MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS],
        loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
      },
      {
        path: 'completed-work',
        title: miReportTypeDescriptionMap[MiReportType.COMPLETED_WORK],
        data: {
          breadcrumb: miReportTypeDescriptionMap[MiReportType.COMPLETED_WORK],
        },
        providers: miReportUseCaseMap[MiReportType.COMPLETED_WORK],
        loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
      },
      {
        path: 'outstanding-request-tasks',
        title: miReportTypeDescriptionMap[MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS],
        data: {
          breadcrumb: miReportTypeDescriptionMap[MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS],
        },
        providers: miReportUseCaseMap[MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS],
        loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
      },
      {
        path: 'verification-body-users',
        title: miReportTypeDescriptionMap[MiReportType.LIST_OF_VERIFICATION_BODY_USERS],
        data: {
          breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_VERIFICATION_BODY_USERS],
        },
        providers: miReportUseCaseMap[MiReportType.LIST_OF_VERIFICATION_BODY_USERS],
        loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
      },
    ],
  },
];
