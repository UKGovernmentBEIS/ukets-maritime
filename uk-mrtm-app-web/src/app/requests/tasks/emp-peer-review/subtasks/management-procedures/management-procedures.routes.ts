import { Routes } from '@angular/router';

import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { canActivateManagementProceduresSummary } from '@requests/tasks/emp-review/subtasks/management-procedures';

export const MANAGEMENT_PROCEDURES_ROUTES: Routes = [
  {
    path: '',
    title: managementProceduresMap.title,
    canActivate: [canActivateManagementProceduresSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/management-procedures').then((c) => c.ManagementProceduresSummaryComponent),
  },
];
