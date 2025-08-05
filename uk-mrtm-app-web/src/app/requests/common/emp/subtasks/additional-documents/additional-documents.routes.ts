import { Routes } from '@angular/router';

import {
  canActivateAdditionalDocumentsStep,
  canActivateAdditionalDocumentsSummary,
} from '@requests/common/emp/subtasks/additional-documents';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { AdditionalDocumentsWizardStep } from '@requests/common/utils/additional-documents';

export const ADDITIONAL_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: additionalDocumentsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateAdditionalDocumentsSummary],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/additional-documents').then((c) => c.AdditionalDocumentsSummaryComponent),
  },
  {
    path: AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD,
    title: additionalDocumentsMap.additionalDocumentsUpload.title,
    canActivate: [canActivateAdditionalDocumentsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AdditionalDocumentsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/additional-documents').then((c) => c.AdditionalDocumentsUploadComponent),
  },
];
