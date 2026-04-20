import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  canActivateVariationDetailsDecision,
  canActivateVariationDetailsStep,
} from '@requests/common/emp/subtasks/variation-details';
import { VariationDetailsWizardStep } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { canActivateVariationReviewDetailsSummary } from '@requests/tasks/emp-variation-review/subtasks/variation-details/variation-details.guard';

export const VARIATION_REVIEW_DETAILS_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateVariationReviewDetailsSummary],
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/variation-details/variation-details-summary').then(
        (c) => c.VariationDetailsSummaryComponent,
      ),
  },
  {
    path: VariationDetailsWizardStep.DECISION,
    data: { breadcrumb: false },
    resolve: { backlink: backlinkResolver(VariationDetailsWizardStep.SUMMARY, '../../') },
    canActivate: [canActivateVariationDetailsDecision],
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/variation-details/variation-details-decision').then(
        (c) => c.VariationDetailsDecisionComponent,
      ),
  },
  {
    path: VariationDetailsWizardStep.DESCRIBE_CHANGES,
    title: variationDetailsSubtaskMap.title,
    data: { breadcrumb: false },
    resolve: { backlink: backlinkResolver(VariationDetailsWizardStep.SUMMARY, '../../') },
    canActivate: [canActivateVariationDetailsStep(VariationDetailsWizardStep.DECISION)],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details').then(
        (c) => c.VariationDetailsComponent,
      ),
  },
];
