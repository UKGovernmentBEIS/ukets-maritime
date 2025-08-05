import { Route } from '@angular/router';

import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const GREENHOUSE_GAS_ROUTES: Route[] = [
  {
    path: '',
    title: greenhouseGasMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/greenhouse-gas').then((c) => c.GreenhouseGasSummaryComponent),
  },
];
