import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AdditionalDocumentsWizardStep,
  isAdditionalDocumentsCompleted,
} from '@requests/common/utils/additional-documents';

export const canActivateAdditionalDocumentsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const additionalDocuments = store.select(empCommonQuery.selectAdditionalDocuments)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();
  const isSubtaskCompleted =
    isAdditionalDocumentsCompleted(additionalDocuments) &&
    store.select(empVariationReviewQuery.selectSubtaskHasDecision(ADDITIONAL_DOCUMENTS_SUB_TASK))();

  return (
    !isEditable ||
    (isEditable && isSubtaskCompleted) ||
    createUrlTreeFromSnapshot(route, ['./', AdditionalDocumentsWizardStep.DECISION])
  );
};
