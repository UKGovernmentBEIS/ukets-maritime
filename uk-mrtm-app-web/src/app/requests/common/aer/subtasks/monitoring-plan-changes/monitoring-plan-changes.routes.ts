import { Routes } from '@angular/router';

import { monitoringPlanChangesMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  canActivateMonitoringPlanChangesForm,
  canActivateMonitoringPlanChangesSummary,
} from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.guard';
import { MonitoringPlanChangesWizardStep } from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';
import { backlinkResolver } from '@requests/common/task-navigation';

export const AER_MONITORING_PLAN_CHANGES_ROUTES: Routes = [
  {
    path: '',
    title: monitoringPlanChangesMap.title,
    canActivate: [canActivateMonitoringPlanChangesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes-summary').then(
        (c) => c.MonitoringPlanChangesSummaryComponent,
      ),
  },
  {
    path: MonitoringPlanChangesWizardStep.FORM,
    title: monitoringPlanChangesMap.heading.title,
    canActivate: [canActivateMonitoringPlanChangesForm],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MonitoringPlanChangesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes-form').then(
        (c) => c.MonitoringPlanChangesFormComponent,
      ),
  },
];
