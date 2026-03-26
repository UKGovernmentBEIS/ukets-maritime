import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  EmissionsReductionClaimsVerificationStep,
  emissionsReductionClaimVerificationSubtaskListMap,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import {
  canActivateEmissionsReductionClaimVerificationStep,
  canActivateEmissionsReductionClaimVerificationSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification/emissions-reduction-claims-verification.guard';

export const EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_ROUTES: Routes = [
  {
    path: '',
    title: emissionsReductionClaimVerificationSubtaskListMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateEmissionsReductionClaimVerificationSummary],
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification/emissions-reduction-claims-verification-summary').then(
        (c) => c.EmissionsReductionClaimsVerificationSummaryComponent,
      ),
  },
  {
    path: EmissionsReductionClaimsVerificationStep.FORM,
    title: emissionsReductionClaimVerificationSubtaskListMap.caption,
    data: { breadcrumb: false },
    canActivate: [canActivateEmissionsReductionClaimVerificationStep],
    resolve: {
      backlink: backlinkResolver(EmissionsReductionClaimsVerificationStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification/emissions-reduction-claims-verification-form').then(
        (c) => c.EmissionsReductionClaimsVerificationFormComponent,
      ),
  },
];
