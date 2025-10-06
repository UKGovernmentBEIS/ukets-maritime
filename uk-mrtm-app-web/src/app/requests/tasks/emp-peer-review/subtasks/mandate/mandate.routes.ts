import { Route } from '@angular/router';

import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const MANDATE_ROUTES: Route[] = [
  {
    path: '',
    title: mandateMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () => import('@requests/common/emp/subtasks/mandate').then((c) => c.MandateSummaryComponent),
  },
];
