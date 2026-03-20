import { Routes } from '@angular/router';

import {
  canActivateReductionClaimDetails,
  canActivateReductionClaimSummary,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.guard';
import { ReductionClaimWizardStep } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const REDUCTION_CLAIM_ROUTES: Routes = [
  {
    path: '',
    title: reductionClaimMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateReductionClaimSummary],
    loadComponent: () =>
      import('@requests/common/aer/subtasks/reduction-claim/reduction-claim-summary').then(
        (c) => c.ReductionClaimSummaryComponent,
      ),
  },
  {
    path: ReductionClaimWizardStep.EXIST,
    title: reductionClaimMap.exist.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(ReductionClaimWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/reduction-claim/reduction-claim-exist').then(
        (c) => c.ReductionClaimExistComponent,
      ),
  },
  {
    path: ReductionClaimWizardStep.DETAILS,
    children: [
      {
        path: '',
        title: reductionClaimMap.smfDetails.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(ReductionClaimWizardStep.SUMMARY, ReductionClaimWizardStep.EXIST),
        },
        canActivate: [canActivateReductionClaimDetails],
        loadComponent: () =>
          import('@requests/common/aer/subtasks/reduction-claim/reduction-claim-details').then(
            (c) => c.ReductionClaimDetailsComponent,
          ),
      },
      {
        path: ReductionClaimWizardStep.FUEL_PURCHASE,
        title: reductionClaimMap.purchaseAdd.title,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(ReductionClaimWizardStep.SUMMARY, `../${ReductionClaimWizardStep.DETAILS}`),
        },
        canActivate: [canActivateReductionClaimDetails],
        loadComponent: () =>
          import('@requests/common/aer/subtasks/reduction-claim/reduction-claim-fuel-purchase').then(
            (c) => c.ReductionClaimFuelPurchaseComponent,
          ),
      },
      {
        path: ':fuelPurchaseId',
        data: { breadcrumb: false },
        title: reductionClaimMap.purchaseEdit.title,
        resolve: {
          backlink: backlinkResolver(
            `../${ReductionClaimWizardStep.SUMMARY}`,
            `../${ReductionClaimWizardStep.DETAILS}`,
          ),
        },
        canActivate: [canActivateReductionClaimDetails],
        loadComponent: () =>
          import('@requests/common/aer/subtasks/reduction-claim/reduction-claim-fuel-purchase').then(
            (c) => c.ReductionClaimFuelPurchaseComponent,
          ),
      },
    ],
  },
];
