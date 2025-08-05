import { Routes } from '@angular/router';

import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const EMISSION_SOURCE_ROUTES: Routes = [
  {
    path: '',
    title: emissionSourcesMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesSummaryComponent),
  },
];
