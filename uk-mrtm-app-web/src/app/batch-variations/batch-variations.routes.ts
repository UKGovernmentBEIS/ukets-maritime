import { Route } from '@angular/router';

import { batchVariationsGuard, canActivateCreateBatchVariation } from '@batch-variations/batch-variations.guard';

export const BATCH_VARIATIONS_ROUTES: Route[] = [
  {
    path: '',
    data: { breadcrumb: true },
    title: 'Batch variations',
    canActivate: [batchVariationsGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@batch-variations/batch-variations-list').then((c) => c.BatchVariationsListComponent),
      },
      {
        path: 'create',
        canActivate: [canActivateCreateBatchVariation],
        loadChildren: () => import('@batch-variations/submit').then((r) => r.SUBMIT_ROUTES),
      },
      {
        path: 'workflows',
        data: {
          breadcrumb: 'Batch variations',
        },
        loadChildren: () => import('@requests/workflows').then((r) => r.WORKFLOWS_ROUTES),
      },
    ],
  },
];
