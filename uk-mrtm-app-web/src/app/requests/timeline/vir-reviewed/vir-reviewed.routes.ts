import { Routes } from '@angular/router';

import { REQUEST_ACTION_PAGE_CONTENT } from '@netz/common/request-action';

import { virSubmittedTaskContent } from '@requests/timeline/vir-submitted';

export const VIR_REVIEWED_ROUTES: Routes = [
  {
    path: '',
    data: { backlink: '../', breadcrumb: false },
    providers: [
      {
        provide: REQUEST_ACTION_PAGE_CONTENT,
        useValue: {
          VIR_APPLICATION_REVIEWED: virSubmittedTaskContent('.'),
        },
      },
    ],
    loadComponent: () => import('@netz/common/request-action').then((c) => c.RequestActionPageComponent),
  },
  {
    path: ':key',
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import('@requests/timeline/vir-submitted/vir-submitted-recommendations').then(
        (c) => c.VirSubmittedRecommendationsComponent,
      ),
  },
];
