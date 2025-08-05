import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { verifierDetailsMap, VerifierDetailsStep } from '@requests/common/aer';
import {
  canActivateVerifierDetailsStep,
  canActivateVerifierDetailsSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/verifier-details/verifier-details.guard';

export const VERIFIER_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: verifierDetailsMap.title,
    canActivate: [canActivateVerifierDetailsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/verifier-details/verifier-details-summary').then(
        (c) => c.VerifierDetailsSummaryComponent,
      ),
  },
  {
    path: VerifierDetailsStep.FORM,
    title: verifierDetailsMap.caption,
    canActivate: [canActivateVerifierDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(VerifierDetailsStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/verifier-details/verifier-details-form').then(
        (c) => c.VerifierDetailsFormComponent,
      ),
  },
];
