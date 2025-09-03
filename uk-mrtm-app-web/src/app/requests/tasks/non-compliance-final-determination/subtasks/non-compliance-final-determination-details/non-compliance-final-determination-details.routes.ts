import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  nonComplianceFinalDeterminationDetailsMap,
  NonComplianceFinalDeterminationDetailsStep,
} from '@requests/common/non-compliance';
import {
  canActivateNonComplianceFinalDeterminationDetailsStep,
  canActivateNonComplianceFinalDeterminationDetailsSummary,
} from '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details/non-compliance-final-determination-details.guard';

export const NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: nonComplianceFinalDeterminationDetailsMap.title,
    canActivate: [canActivateNonComplianceFinalDeterminationDetailsSummary],
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details/non-compliance-final-determination-details-summary'
      ).then((c) => c.NonComplianceFinalDeterminationDetailsSummaryComponent),
  },
  {
    path: NonComplianceFinalDeterminationDetailsStep.DETAILS_FORM,
    title: nonComplianceFinalDeterminationDetailsMap.caption,
    canActivate: [canActivateNonComplianceFinalDeterminationDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceFinalDeterminationDetailsStep.SUMMARY, '../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details/non-compliance-final-determination-details-form'
      ).then((c) => c.NonComplianceFinalDeterminationDetailsFormComponent),
  },
];
