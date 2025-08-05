import { AerMaterialityLevel } from '@mrtm/api';

import { MaterialityLevelStep } from '@requests/common/aer';

export const isWizardCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return isMaterialityDetailsStepCompleted(materialityLevel) && isReferenceDocumentsStepCompleted(materialityLevel);
};

export const getNextIncompleteStep = (materialityLevel: AerMaterialityLevel): MaterialityLevelStep => {
  if (!isMaterialityDetailsStepCompleted(materialityLevel)) {
    return MaterialityLevelStep.DETAILS;
  } else if (!isReferenceDocumentsStepCompleted(materialityLevel)) {
    return MaterialityLevelStep.REFERENCE_DOCUMENTS;
  }

  return MaterialityLevelStep.DETAILS;
};

export const isMaterialityDetailsStepCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return !!materialityLevel?.materialityDetails;
};

const isReferenceDocumentsStepCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return (materialityLevel?.accreditationReferenceDocumentTypes ?? []).includes('OTHER')
    ? !!materialityLevel?.otherReference
    : !!materialityLevel?.accreditationReferenceDocumentTypes?.length;
};
