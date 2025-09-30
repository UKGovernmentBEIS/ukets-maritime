import { EmpOperatorDetails } from '@mrtm/api';

import { isOperatorDetailsCoreCompleted } from '@requests/common/components/operator-details';

export const isEmpOperatorDetailsCompleted = (operatorDetails: EmpOperatorDetails) => {
  return isOperatorDetailsCoreCompleted(operatorDetails) && !!operatorDetails?.activityDescription;
};
