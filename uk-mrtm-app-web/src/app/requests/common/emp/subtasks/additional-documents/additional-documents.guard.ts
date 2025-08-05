import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  AdditionalDocumentsWizardStep,
  isAdditionalDocumentsCompleted,
} from '@requests/common/utils/additional-documents';

export const canActivateAdditionalDocumentsStep =
  (fallbackStep: AdditionalDocumentsWizardStep = AdditionalDocumentsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const additionalDocuments = store.select(empCommonQuery.selectAdditionalDocuments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [AdditionalDocumentsWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === AdditionalDocumentsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isAdditionalDocumentsCompleted(additionalDocuments) ||
      change ||
      createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateAdditionalDocumentsDecision: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  if (!isEditable) return createUrlTreeFromSnapshot(route, [AdditionalDocumentsWizardStep.SUMMARY]);

  return true;
};

export const canActivateAdditionalDocumentsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const additionalDocuments = store.select(empCommonQuery.selectAdditionalDocuments)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isAdditionalDocumentsCompleted(additionalDocuments)) ||
    createUrlTreeFromSnapshot(route, ['./', AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD])
  );
};
