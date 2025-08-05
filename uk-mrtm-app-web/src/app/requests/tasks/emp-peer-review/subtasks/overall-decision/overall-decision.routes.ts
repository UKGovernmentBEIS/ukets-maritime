import { Routes } from '@angular/router';

import { overallDecisionMap } from '@requests/common/emp/subtasks/overall-decision';

export const OVERALL_DECISION_ROUTES: Routes = [
  {
    path: '',
    title: overallDecisionMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/emp-peer-review/subtasks/overall-decision').then(
        (c) => c.OverallDecisionPeerReviewSummaryComponent,
      ),
  },
];
