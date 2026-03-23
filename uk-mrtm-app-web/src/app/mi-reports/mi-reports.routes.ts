import { Routes } from '@angular/router';

import { miReportTypeDescriptionMap } from '@mi-reports/core/mi-report';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportsListGuard } from '@mi-reports/core/mi-reports-list.guard';
import { CustomReportComponent } from '@mi-reports/custom/custom.component';
import { MiReportsComponent } from '@mi-reports/mi-reports.component';
import { miReportUseCaseMap } from '@mi-reports/use-cases';

export const MI_REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: MiReportsComponent,
    canActivate: [MiReportsListGuard],
    resolve: { miReports: MiReportsListGuard },
  },
  {
    path: 'custom',
    data: { breadcrumb: 'Custom SQL report' },
    component: CustomReportComponent,
  },
  {
    path: 'accounts-users-contacts',
    data: {
      breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
    },
    providers: miReportUseCaseMap[MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS],
    loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
  },
  {
    path: 'assigned-regulator-site-contacts',
    data: {
      breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS],
    },
    providers: miReportUseCaseMap[MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS],
    loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
  },
  {
    path: 'completed-work',
    data: {
      breadcrumb: miReportTypeDescriptionMap[MiReportType.COMPLETED_WORK],
    },
    providers: miReportUseCaseMap[MiReportType.COMPLETED_WORK],
    loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
  },
  {
    path: 'outstanding-request-tasks',
    data: {
      breadcrumb: miReportTypeDescriptionMap[MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS],
    },
    providers: miReportUseCaseMap[MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS],
    loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
  },
  {
    path: 'verification-body-users',
    data: {
      breadcrumb: miReportTypeDescriptionMap[MiReportType.LIST_OF_VERIFICATION_BODY_USERS],
    },
    providers: miReportUseCaseMap[MiReportType.LIST_OF_VERIFICATION_BODY_USERS],
    loadComponent: () => import('@mi-reports/report-preview').then((c) => c.ReportPreviewComponent),
  },
];
