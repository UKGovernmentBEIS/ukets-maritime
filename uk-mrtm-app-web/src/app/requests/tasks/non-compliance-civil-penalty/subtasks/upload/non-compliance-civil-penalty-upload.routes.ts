import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { nonComplianceCivilPenaltyMap, NonComplianceCivilPenaltyUploadStep } from '@requests/common/non-compliance';
import {
  canActivateNonComplianceCivilPenaltyUploadStep,
  canActivateNonComplianceCivilPenaltyUploadSummary,
} from '@requests/tasks/non-compliance-civil-penalty/subtasks/upload/non-compliance-civil-penalty-upload.guard';

export const NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_ROUTES: Routes = [
  {
    path: '',
    title: nonComplianceCivilPenaltyMap.title,
    canActivate: [canActivateNonComplianceCivilPenaltyUploadSummary],
    data: { breadcrumb: false, backlink: '../' },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-civil-penalty/subtasks/upload/non-compliance-civil-penalty-upload-summary'
      ).then((c) => c.NonComplianceCivilPenaltyUploadSummaryComponent),
  },
  {
    path: NonComplianceCivilPenaltyUploadStep.UPLOAD_FORM,
    title: nonComplianceCivilPenaltyMap.caption,
    canActivate: [canActivateNonComplianceCivilPenaltyUploadStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(NonComplianceCivilPenaltyUploadStep.SUMMARY, '../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/non-compliance-civil-penalty/subtasks/upload/non-compliance-civil-penalty-upload-form'
      ).then((c) => c.NonComplianceCivilPenaltyUploadFormComponent),
  },
];
