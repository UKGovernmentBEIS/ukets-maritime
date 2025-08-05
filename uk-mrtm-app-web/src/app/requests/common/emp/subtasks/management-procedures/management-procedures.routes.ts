import { Routes } from '@angular/router';

import {
  canActivateManagementProceduresStep,
  canActivateManagementProceduresSummary,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const MANAGEMENT_PROCEDURES_ROUTES: Routes = [
  {
    path: '',
    title: managementProceduresMap.title,
    canActivate: [canActivateManagementProceduresSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures').then((c) => c.ManagementProceduresSummaryComponent),
  },
  {
    path: ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES,
    canActivate: [canActivateManagementProceduresStep()],
    title: managementProceduresMap.monitoringReportingRoles.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ManagementProceduresWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures/management-procedures-roles').then(
        (c) => c.ManagementProceduresRolesComponent,
      ),
  },
  {
    path: ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY,
    title: managementProceduresMap.regularCheckOfAdequacy.title,
    canActivate: [canActivateManagementProceduresStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ManagementProceduresWizardStep.SUMMARY,
        ManagementProceduresWizardStep.MONITORING_REPORTING_ROLES,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures/management-procedures-adequacy').then(
        (c) => c.ManagementProceduresAdequacyComponent,
      ),
  },
  {
    path: ManagementProceduresWizardStep.DATA_FLOW_ACTIVITIES,
    title: managementProceduresMap.dataFlowActivities.title,
    canActivate: [canActivateManagementProceduresStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ManagementProceduresWizardStep.SUMMARY,
        ManagementProceduresWizardStep.REGULAR_CHECK_OF_ADEQUACY,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures/management-procedures-data-flow').then(
        (c) => c.ManagementProceduresDataFlowComponent,
      ),
  },
  {
    path: ManagementProceduresWizardStep.RISK_ASSESSMENT_PROCEDURES,
    title: managementProceduresMap.riskAssessmentProcedures.title,
    canActivate: [canActivateManagementProceduresStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        ManagementProceduresWizardStep.SUMMARY,
        ManagementProceduresWizardStep.DATA_FLOW_ACTIVITIES,
      ),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures/management-procedures-risk-assessment').then(
        (c) => c.ManagementProceduresRiskAssessmentComponent,
      ),
  },
];
