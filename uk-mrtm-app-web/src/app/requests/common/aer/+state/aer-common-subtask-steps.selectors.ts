import { Provider } from '@angular/core';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY, RequestTaskCommonSubtaskStepsQuery } from '@requests/+state';
import { aerCommonQuery } from '@requests/common/aer/+state/aer-common.selectors';

export const aerCommonSubtaskStepsQuery: RequestTaskCommonSubtaskStepsQuery = {
  selectAttachments: aerCommonQuery.selectAerAttachments,
  selectOperatorDetails: aerCommonQuery.selectAerOperatorDetails,
  selectAttachedFiles: aerCommonQuery.selectAttachedFiles,
  selectIsSubtaskCompleted: aerCommonQuery.selectIsSubtaskCompleted,
  selectShips: aerCommonQuery.selectShips,
  selectShip: aerCommonQuery.selectShip,
  selectShipName: aerCommonQuery.selectShipName,
  selectShipFuelsAndEmissionsFactors: aerCommonQuery.selectShipFuelsAndEmissionsFactors,
  selectShipFuelsAndEmissionsFactorsItem: aerCommonQuery.selectShipFuelsAndEmissionsFactorsItem,
  selectShipEmissionSources: aerCommonQuery.selectShipEmissionSources,
  selectShipMonitoringMethods: aerCommonQuery.selectShipMonitoringMethods,
  selectListOfShips: aerCommonQuery.selectListOfShips,
};

export const aerCommonSubtaskStepsProvider: Provider = {
  provide: REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY,
  useValue: aerCommonSubtaskStepsQuery,
};
