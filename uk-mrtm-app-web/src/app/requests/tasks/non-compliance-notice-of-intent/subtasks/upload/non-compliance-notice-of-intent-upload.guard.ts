import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { NonComplianceNoticeOfIntentUploadStep } from '@requests/common/non-compliance';
import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { isWizardCompleted } from '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload/non-compliance-notice-of-intent-upload.wizard';

export const canActivateNonComplianceNoticeOfIntentUploadSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const nonComplianceNoticeOfIntentUpload = store.select(
    nonComplianceNoticeOfIntentCommonQuery.selectNonComplianceNoticeOfIntentUpload,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(nonComplianceNoticeOfIntentUpload)) ||
    createUrlTreeFromSnapshot(route, [`./${NonComplianceNoticeOfIntentUploadStep.UPLOAD_FORM}`])
  );
};

export const canActivateNonComplianceNoticeOfIntentUploadStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceNoticeOfIntentUpload = store.select(
    nonComplianceNoticeOfIntentCommonQuery.selectNonComplianceNoticeOfIntentUpload,
  )();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    ((!isWizardCompleted(nonComplianceNoticeOfIntentUpload) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
