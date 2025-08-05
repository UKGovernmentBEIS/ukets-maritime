import { Routes } from '@angular/router';

import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const ABBREVIATIONS_ROUTES: Routes = [
  {
    path: '',
    title: abbreviationsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/abbreviations').then((c) => c.AbbreviationsSummaryComponent),
  },
];
