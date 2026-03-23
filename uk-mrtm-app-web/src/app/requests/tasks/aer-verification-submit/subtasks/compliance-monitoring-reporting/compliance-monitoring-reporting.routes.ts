import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { complianceMonitoringReportingMap, ComplianceMonitoringReportingStep } from '@requests/common/aer';
import {
  canActivateComplianceMonitoringReportingStep,
  canActivateComplianceMonitoringReportingSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting.guard';

export const COMPLIANCE_MONITORING_REPORTING_ROUTES: Routes = [
  {
    path: '',
    title: complianceMonitoringReportingMap.caption,
    canActivate: [canActivateComplianceMonitoringReportingSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-summary'
      ).then((c) => c.ComplianceMonitoringReportingSummaryComponent),
  },
  {
    path: ComplianceMonitoringReportingStep.ACCURACY,
    title: complianceMonitoringReportingMap.title,
    canActivate: [canActivateComplianceMonitoringReportingStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ComplianceMonitoringReportingStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-accuracy'
      ).then((c) => c.ComplianceMonitoringReportingAccuracyComponent),
  },
  {
    path: ComplianceMonitoringReportingStep.COMPLETENESS,
    title: complianceMonitoringReportingMap.title,
    canActivate: [canActivateComplianceMonitoringReportingStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ComplianceMonitoringReportingStep.SUMMARY, ComplianceMonitoringReportingStep.ACCURACY),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-completeness'
      ).then((c) => c.ComplianceMonitoringReportingCompletenessComponent),
  },
  {
    path: ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY,
    title: complianceMonitoringReportingMap.title,
    canActivate: [canActivateComplianceMonitoringReportingStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ComplianceMonitoringReportingStep.SUMMARY,
        ComplianceMonitoringReportingStep.COMPLETENESS,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-cct'
      ).then((c) => c.ComplianceMonitoringReportingCctComponent),
  },
  {
    path: ComplianceMonitoringReportingStep.INTEGRITY,
    title: complianceMonitoringReportingMap.title,
    canActivate: [canActivateComplianceMonitoringReportingStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ComplianceMonitoringReportingStep.SUMMARY,
        ComplianceMonitoringReportingStep.CONSISTENCY_COMPARABILITY_TRANSPARENCY,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting-integrity'
      ).then((c) => c.ComplianceMonitoringReportingIntegrityComponent),
  },
];
