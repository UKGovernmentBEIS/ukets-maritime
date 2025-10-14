import { AerMaterialityLevel } from '@mrtm/api';

export const isWizardCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return isMaterialityDetailsStepCompleted(materialityLevel) && isReferenceDocumentsStepCompleted(materialityLevel);
};

export const isMaterialityDetailsStepCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return !!materialityLevel?.materialityDetails;
};

const isReferenceDocumentsStepCompleted = (materialityLevel: AerMaterialityLevel): boolean => {
  return (materialityLevel?.accreditationReferenceDocumentTypes ?? []).includes('OTHER')
    ? !!materialityLevel?.otherReference
    : !!materialityLevel?.accreditationReferenceDocumentTypes?.length;
};
