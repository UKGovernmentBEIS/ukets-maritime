import { Provider } from '@angular/core';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY, RequestTaskCommonSubtaskStepsQuery } from '@requests/+state';
import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';

export const empCommonSubtaskStepsQuery: RequestTaskCommonSubtaskStepsQuery = {
  selectAttachments: empCommonQuery?.selectEmpAttachments,
  selectOperatorDetails: empCommonQuery?.selectOperatorDetails,
  selectAttachedFiles: empCommonQuery?.selectAttachedFiles,
  selectIsSubtaskCompleted: empCommonQuery?.selectIsSubtaskCompleted,
  selectShips: empCommonQuery?.selectShips,
  selectShip: empCommonQuery?.selectShip,
  selectShipName: empCommonQuery?.selectShipName,
  selectShipFuelsAndEmissionsFactors: empCommonQuery?.selectShipFuelsAndEmissionsFactors,
  selectShipFuelsAndEmissionsFactorsItem: empCommonQuery?.selectShipFuelsAndEmissionsFactorsItem,
  selectShipEmissionSources: empCommonQuery?.selectShipEmissionSources,
  selectShipMonitoringMethods: empCommonQuery?.selectShipMonitoringMethods,
  selectListOfShips: empCommonQuery?.selectListOfShips,
};

export const empCommonSubtaskStepsProvider: Provider = {
  provide: REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY,
  useValue: empCommonSubtaskStepsQuery,
};
