import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  nonComplianceInitialPenaltyNoticeMap,
  NonComplianceInitialPenaltyNoticeUploadStep,
} from '@requests/common/non-compliance';
import {
  canActivateNonComplianceInitialPenaltyNoticeUploadStep,
  canActivateNonComplianceInitialPenaltyNoticeUploadSummary,
} from '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload.guard';

export const NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_ROUTES: Routes = [
  {
    path: '',
    title: nonComplianceInitialPenaltyNoticeMap.title,
    canActivate: [canActivateNonComplianceInitialPenaltyNoticeUploadSummary],
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload-summary'
      ).then((c) => c.NonComplianceInitialPenaltyNoticeUploadSummaryComponent),
  },
  {
    path: NonComplianceInitialPenaltyNoticeUploadStep.UPLOAD_FORM,
    title: nonComplianceInitialPenaltyNoticeMap.caption,
    canActivate: [canActivateNonComplianceInitialPenaltyNoticeUploadStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceInitialPenaltyNoticeUploadStep.SUMMARY, '../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload-form'
      ).then((c) => c.NonComplianceInitialPenaltyNoticeUploadFormComponent),
  },
];
