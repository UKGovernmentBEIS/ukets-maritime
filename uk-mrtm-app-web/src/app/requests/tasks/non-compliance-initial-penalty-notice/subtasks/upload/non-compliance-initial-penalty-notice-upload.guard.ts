import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { NonComplianceInitialPenaltyNoticeUploadStep } from '@requests/common/non-compliance';
import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { isWizardCompleted } from '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload.wizard';

export const canActivateNonComplianceInitialPenaltyNoticeUploadSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const nonComplianceInitialPenaltyNoticeUpload = store.select(
    nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  )();
  const isEditable = store.select(nonComplianceInitialPenaltyNoticeCommonQuery.selectIsFormEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(nonComplianceInitialPenaltyNoticeUpload)) ||
    createUrlTreeFromSnapshot(route, [`./${NonComplianceInitialPenaltyNoticeUploadStep.UPLOAD_FORM}`])
  );
};

export const canActivateNonComplianceInitialPenaltyNoticeUploadStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceInitialPenaltyNoticeUpload = store.select(
    nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  )();
  const isEditable = store.select(nonComplianceInitialPenaltyNoticeCommonQuery.selectIsFormEditable)();

  return (
    ((!isWizardCompleted(nonComplianceInitialPenaltyNoticeUpload) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
