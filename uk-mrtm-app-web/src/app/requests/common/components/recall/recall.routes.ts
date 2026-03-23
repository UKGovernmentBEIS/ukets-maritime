import { Routes } from '@angular/router';

export const RECALL_ROUTES: Routes = [
  {
    path: '',
    data: { backlink: '../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/components/recall/recall-question').then((c) => c.RecallQuestionComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('@requests/common/components/recall/recall-success').then((c) => c.RecallSuccessComponent),
  },
];
