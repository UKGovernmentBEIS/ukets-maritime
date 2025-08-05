import { Routes } from '@angular/router';

import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  canActivateRegulatorVariationDetailsStep,
  canActivateRegulatorVariationDetailsSummary,
} from '@requests/common/emp/subtasks/variation-details/variation-details.guard';
import { VariationDetailsWizardStep } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { backlinkResolver } from '@requests/common/task-navigation';

export const EMP_VARIATION_REGULATOR_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: variationDetailsSubtaskMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateRegulatorVariationDetailsSummary],
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
    canActivate: [canActivateRegulatorVariationDetailsStep()],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details').then(
        (c) => c.VariationDetailsComponent,
      ),
  },
  {
    path: VariationDetailsWizardStep.REASON_NOTICE,
    title: variationDetailsSubtaskMap.reasonRegulatorLed.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(VariationDetailsWizardStep.SUMMARY, VariationDetailsWizardStep.DESCRIBE_CHANGES),
    },
    canActivate: [canActivateRegulatorVariationDetailsStep()],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details-reason-notice').then(
        (c) => c.VariationDetailsReasonNoticeComponent,
      ),
  },
  {
    path: VariationDetailsWizardStep.CHANGES_SUMMARY,
    title: variationDetailsSubtaskMap.summary.title,
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(VariationDetailsWizardStep.SUMMARY, VariationDetailsWizardStep.REASON_NOTICE),
    },
    canActivate: [canActivateRegulatorVariationDetailsStep()],
    loadComponent: () =>
      import('@requests/common/emp/subtasks/variation-details/variation-details-summary-form').then(
        (c) => c.VariationDetailsSummaryFormComponent,
      ),
  },
];
