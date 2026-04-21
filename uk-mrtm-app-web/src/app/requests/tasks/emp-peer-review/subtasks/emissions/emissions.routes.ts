import { Routes } from '@angular/router';

import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsBacklinkResolver } from '@requests/common/emp/subtasks/emissions/emissions-backlink.resolver';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { canActivateEmissionsSummary } from '@requests/tasks/emp-review/subtasks/emissions/emissions.guard';

export const EMISSIONS_ROUTES: Routes = [
  {
    path: '',
    title: emissionsSubTasksMap.title,
    data: { breadcrumb: false },
    canActivate: [canActivateEmissionsSummary],
    resolve: { backlink: emissionsBacklinkResolver(EmissionsWizardStep.SUMMARY) },
    loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ListOfShipsSummaryComponent),
  },
  {
    path: 'ships/:shipId',
    title: emissionsSubTasksMap.title,
    data: { breadcrumb: false },
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ShipSummaryComponent),
      },
    ],
  },
];
