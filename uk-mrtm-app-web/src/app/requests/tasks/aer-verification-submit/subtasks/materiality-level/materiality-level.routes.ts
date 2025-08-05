import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { materialityLevelMap, MaterialityLevelStep } from '@requests/common/aer';
import {
  canActivateMaterialityLevelDetailsStep,
  canActivateMaterialityLevelReferenceDocumentsStep,
  canActivateMaterialityLevelSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level.guard';

export const MATERIALITY_LEVEL_ROUTES: Routes = [
  {
    path: '',
    title: materialityLevelMap.caption,
    canActivate: [canActivateMaterialityLevelSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-summary').then(
        (c) => c.MaterialityLevelSummaryComponent,
      ),
  },
  {
    path: MaterialityLevelStep.DETAILS,
    title: materialityLevelMap.materialityDetails.title,
    canActivate: [canActivateMaterialityLevelDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MaterialityLevelStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-details').then(
        (c) => c.MaterialityLevelDetailsComponent,
      ),
  },
  {
    path: MaterialityLevelStep.REFERENCE_DOCUMENTS,
    title: materialityLevelMap.accreditationReferenceDocumentTypes.title,
    canActivate: [canActivateMaterialityLevelReferenceDocumentsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(MaterialityLevelStep.SUMMARY, MaterialityLevelStep.DETAILS),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-reference-documents'
      ).then((c) => c.MaterialityLevelReferenceDocumentsComponent),
  },
];
