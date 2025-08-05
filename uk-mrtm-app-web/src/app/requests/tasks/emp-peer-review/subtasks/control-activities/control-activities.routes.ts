import { Routes } from '@angular/router';

import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const CONTROL_ACTIVITY_ROUTES: Routes = [
  {
    path: '',
    title: controlActivitiesMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/control-activities').then((c) => c.ControlActivitiesSummaryComponent),
  },
];
