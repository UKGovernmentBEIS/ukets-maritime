import { Routes } from '@angular/router';

import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  canActivateVariationDetailsStep,
  canActivateVariationDetailsSummary,
} from '@requests/common/emp/subtasks/variation-details/variation-details.guard';
import { VariationDetailsWizardStep } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { backlinkResolver } from '@requests/common/task-navigation';

export const EMP_VARIATION_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: variationDetailsSubtaskMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateVariationDetailsSummary],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details-summary').then(
        (c) => c.VariationDetailsSummaryComponent,
      ),
  },
  {
    path: VariationDetailsWizardStep.DESCRIBE_CHANGES,
    title: variationDetailsSubtaskMap.empVariationDetails.title,
    data: { breadcrumb: false },
    resolve: { backlink: backlinkResolver(VariationDetailsWizardStep.SUMMARY, '../../') },
    canActivate: [canActivateVariationDetailsStep()],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details').then(
        (c) => c.VariationDetailsComponent,
      ),
  },
];
