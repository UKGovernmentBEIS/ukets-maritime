import { Routes } from '@angular/router';

import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const OPERATOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: identifyMaritimeOperatorMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/operator-details').then((c) => c.OperatorDetailsSummaryComponent),
  },
];
