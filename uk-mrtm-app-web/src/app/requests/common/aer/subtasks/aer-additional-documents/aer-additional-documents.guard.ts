import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AdditionalDocumentsWizardStep,
  isAdditionalDocumentsCompleted,
} from '@requests/common/utils/additional-documents';

export const canActivateAerAdditionalDocumentsStep =
  (fallbackStep: AdditionalDocumentsWizardStep = AdditionalDocumentsWizardStep.SUMMARY): CanActivateFn =>
  (route) => {
    const store = inject(RequestTaskStore);
    const change = route.queryParamMap.get('change') === 'true';

    const aerAdditionalDocuments = store.select(aerCommonQuery.selectAerAdditionalDocuments)();
    const isEditable = store.select(requestTaskQuery.selectIsEditable)();

    if (!isEditable) return createUrlTreeFromSnapshot(route, [AdditionalDocumentsWizardStep.SUMMARY]);

    const fallbackRedirect =
      fallbackStep === AdditionalDocumentsWizardStep.SUMMARY ? [fallbackStep] : ['../', fallbackStep];

    return (
      !isAdditionalDocumentsCompleted(aerAdditionalDocuments) ||
      change ||
      createUrlTreeFromSnapshot(route, fallbackRedirect)
    );
  };

export const canActivateAerAdditionalDocumentsSummary: CanActivateFn = (route) => {
  const store = inject(RequestTaskStore);
  const aerAdditionalDocuments = store.select(aerCommonQuery.selectAerAdditionalDocuments)();
  const isEditable = store.select(requestTaskQuery.selectIsEditable)();

  return (
    !isEditable ||
    (isEditable && isAdditionalDocumentsCompleted(aerAdditionalDocuments)) ||
    createUrlTreeFromSnapshot(route, ['./', AdditionalDocumentsWizardStep.ADDITIONAL_DOCUMENTS_UPLOAD])
  );
};
