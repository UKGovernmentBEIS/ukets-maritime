import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { nonComplianceNoticeOfIntentMap, NonComplianceNoticeOfIntentUploadStep } from '@requests/common/non-compliance';
import {
  canActivateNonComplianceNoticeOfIntentUploadStep,
  canActivateNonComplianceNoticeOfIntentUploadSummary,
} from '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload/non-compliance-notice-of-intent-upload.guard';

export const NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_ROUTES: Routes = [
  {
    path: '',
    title: nonComplianceNoticeOfIntentMap.title,
    canActivate: [canActivateNonComplianceNoticeOfIntentUploadSummary],
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload/non-compliance-notice-of-intent-upload-summary'
      ).then((c) => c.NonComplianceNoticeOfIntentUploadSummaryComponent),
  },
  {
    path: NonComplianceNoticeOfIntentUploadStep.UPLOAD_FORM,
    title: nonComplianceNoticeOfIntentMap.caption,
    canActivate: [canActivateNonComplianceNoticeOfIntentUploadStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceNoticeOfIntentUploadStep.SUMMARY, '../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload/non-compliance-notice-of-intent-upload-form'
      ).then((c) => c.NonComplianceNoticeOfIntentUploadFormComponent),
  },
];
