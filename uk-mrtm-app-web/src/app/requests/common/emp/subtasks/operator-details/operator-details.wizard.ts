import { DeclarationDocuments, EmpOperatorDetails } from '@mrtm/api';

import { isOperatorDetailsCoreCompleted } from '@requests/common/components/operator-details';

const isDeclarationDocumentsCompleted = (declarationDocuments: DeclarationDocuments) => {
  return (
    declarationDocuments?.exist === false ||
    (declarationDocuments?.exist === true && declarationDocuments?.documents?.length > 0)
  );
};

export const isEmpOperatorDetailsCompleted = (operatorDetails: EmpOperatorDetails) => {
  return (
    isOperatorDetailsCoreCompleted(operatorDetails) &&
    !!operatorDetails?.activityDescription &&
    isDeclarationDocumentsCompleted(operatorDetails?.declarationDocuments)
  );
};
