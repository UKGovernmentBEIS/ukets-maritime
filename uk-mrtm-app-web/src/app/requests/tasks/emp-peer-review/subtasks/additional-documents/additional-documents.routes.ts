import { Routes } from '@angular/router';

import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';

export const ADDITIONAL_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: additionalDocumentsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/additional-documents').then((c) => c.AdditionalDocumentsSummaryComponent),
  },
];
