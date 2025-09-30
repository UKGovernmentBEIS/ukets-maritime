import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { nonComplianceDetailsMap, NonComplianceDetailsStep } from '@requests/common/non-compliance';
import {
  canActivateNonComplianceDetailsOptionalStep,
  canActivateNonComplianceDetailsStep,
  canActivateNonComplianceDetailsSummary,
} from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details.guard';

export const NON_COMPLIANCE_DETAILS_ROUTES: Routes = [
  {
    path: '',
    title: nonComplianceDetailsMap.title,
    canActivate: [canActivateNonComplianceDetailsSummary],
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-summary'
      ).then((c) => c.NonComplianceDetailsSummaryComponent),
  },
  {
    path: NonComplianceDetailsStep.DETAILS_FORM,
    title: nonComplianceDetailsMap.caption,
    canActivate: [canActivateNonComplianceDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceDetailsStep.SUMMARY, '../'),
    },
    loadComponent: () =>
      import('@requests/common/non-compliance/components/non-compliance-details-base').then(
        (c) => c.NonComplianceDetailsBaseComponent,
      ),
  },
  {
    path: NonComplianceDetailsStep.SELECTED_REQUESTS,
    title: nonComplianceDetailsMap.selectedRequests.title,
    canActivate: [canActivateNonComplianceDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceDetailsStep.SUMMARY, NonComplianceDetailsStep.DETAILS_FORM),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-selected-requests'
      ).then((c) => c.NonComplianceDetailsSelectedRequestsComponent),
  },
  {
    path: NonComplianceDetailsStep.CIVIL_PENALTY,
    title: nonComplianceDetailsMap.civilPenalty.title,
    canActivate: [canActivateNonComplianceDetailsStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceDetailsStep.SUMMARY, NonComplianceDetailsStep.SELECTED_REQUESTS),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-civil-penalty'
      ).then((c) => c.NonComplianceDetailsCivilPenaltyComponent),
  },
  {
    path: NonComplianceDetailsStep.NOTICE_OF_INTENT,
    title: nonComplianceDetailsMap.noticeOfIntent.title,
    canActivate: [canActivateNonComplianceDetailsOptionalStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceDetailsStep.SUMMARY, NonComplianceDetailsStep.CIVIL_PENALTY),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-notice-of-intent'
      ).then((c) => c.NonComplianceDetailsNoticeOfIntentComponent),
  },
  {
    path: NonComplianceDetailsStep.INITIAL_PENALTY,
    title: nonComplianceDetailsMap.initialPenalty.title,
    canActivate: [canActivateNonComplianceDetailsOptionalStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceDetailsStep.SUMMARY, NonComplianceDetailsStep.NOTICE_OF_INTENT),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-initial-penalty'
      ).then((c) => c.NonComplianceDetailsInitialPenaltyComponent),
  },
];
