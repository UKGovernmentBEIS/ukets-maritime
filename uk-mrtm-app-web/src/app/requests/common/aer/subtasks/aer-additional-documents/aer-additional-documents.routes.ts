import { Routes } from '@angular/router';

import {
  canActivateAerAdditionalDocumentsStep,
  canActivateAerAdditionalDocumentsSummary,
} from '@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents.guard';
import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-subtasks-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { AdditionalDocumentsWizardStep } from '@requests/common/utils/additional-documents/additional-documents.helper';

export const AER_ADDITIONAL_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: aerAdditionalDocumentsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateAerAdditionalDocumentsSummary],
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-summary').then(
        (c) => c.AerAdditionalDocumentsSummaryComponent,
      ),
  },
  {
    path: AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD,
    title: aerAdditionalDocumentsMap.additionalDocumentsUpload.title,
    canActivate: [canActivateAerAdditionalDocumentsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AdditionalDocumentsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-additional-documents/aer-additional-documents-upload').then(
        (c) => c.AerAdditionalDocumentsUploadComponent,
      ),
  },
];
