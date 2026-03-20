import { Routes } from '@angular/router';

export const VIR_SUBMITTED_ROUTES: Routes = [
  {
    path: ':key',
    title: 'Check your answers',
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/timeline/vir-submitted/vir-submitted-recommendations').then(
        (c) => c.VirSubmittedRecommendationsComponent,
      ),
  },
];
