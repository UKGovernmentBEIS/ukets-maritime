import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { NonComplianceCivilPenaltyUploadStep } from '@requests/common/non-compliance';
import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { isWizardCompleted } from '@requests/tasks/non-compliance-civil-penalty/subtasks/upload/non-compliance-civil-penalty-upload.wizard';

export const canActivateNonComplianceCivilPenaltyUploadSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const nonComplianceCivilPenaltyUpload = store.select(
    nonComplianceCivilPenaltyCommonQuery.selectNonComplianceCivilPenaltyUpload,
  )();
  const isEditable = store.select(nonComplianceCivilPenaltyCommonQuery.selectIsFormEditable)();

  return (
    !isEditable ||
    (isEditable && isWizardCompleted(nonComplianceCivilPenaltyUpload)) ||
    createUrlTreeFromSnapshot(route, [`./${NonComplianceCivilPenaltyUploadStep.UPLOAD_FORM}`])
  );
};

export const canActivateNonComplianceCivilPenaltyUploadStep: CanActivateFn = (route) => {
  const isChange = route.queryParamMap.get('change') === 'true';
  const store = inject(RequestTaskStore);
  const nonComplianceCivilPenaltyUpload = store.select(
    nonComplianceCivilPenaltyCommonQuery.selectNonComplianceCivilPenaltyUpload,
  )();
  const isEditable = store.select(nonComplianceCivilPenaltyCommonQuery.selectIsFormEditable)();

  return (
    ((!isWizardCompleted(nonComplianceCivilPenaltyUpload) || isChange) && isEditable) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
