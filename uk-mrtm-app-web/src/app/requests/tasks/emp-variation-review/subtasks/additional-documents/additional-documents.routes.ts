import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  canActivateAdditionalDocumentsDecision,
  canActivateAdditionalDocumentsStep,
} from '@requests/common/emp/subtasks/additional-documents';
import { additionalDocumentsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { AdditionalDocumentsWizardStep } from '@requests/common/utils/additional-documents';
import { canActivateAdditionalDocumentsSummary } from '@requests/tasks/emp-variation-review/subtasks/additional-documents';

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
    path: AdditionalDocumentsWizardStep.DECISION,
    title: additionalDocumentsMap.decision.title,
    canActivate: [canActivateAdditionalDocumentsDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AdditionalDocumentsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/additional-documents').then(
        (c) => c.AdditionalDocumentsVariationReviewDecisionComponent,
      ),
  },
  {
    path: AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD,
    title: additionalDocumentsMap.additionalDocumentsUpload.title,
    canActivate: [canActivateAdditionalDocumentsStep(AdditionalDocumentsWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AdditionalDocumentsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/additional-documents').then((c) => c.AdditionalDocumentsUploadComponent),
  },
];
