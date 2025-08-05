import { Routes } from '@angular/router';

import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const DATA_GAPS_ROUTES: Routes = [
  {
    path: '',
    title: dataGapsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () => import('@requests/common/emp/subtasks/data-gaps').then((c) => c.DataGapsSummaryComponent),
  },
];
