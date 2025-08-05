import { AdditionalDocuments } from '@mrtm/api';

export const isAdditionalDocumentsCompleted = (additionalDocuments?: AdditionalDocuments) => {
  return (
    additionalDocuments?.exist === false ||
    (additionalDocuments?.exist === true && additionalDocuments?.documents?.length > 0)
  );
};
