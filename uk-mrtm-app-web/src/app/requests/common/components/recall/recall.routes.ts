import { Routes } from '@angular/router';

export const RECALL_ROUTES: Routes = [
  {
    path: '',
    title: 'Recall action',
    data: { backlink: '../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/components/recall/recall-question').then((c) => c.RecallQuestionComponent),
  },
  {
    path: 'success',
    title: 'Recalled action successfully',
    loadComponent: () =>
      import('@requests/common/components/recall/recall-success').then((c) => c.RecallSuccessComponent),
  },
];
