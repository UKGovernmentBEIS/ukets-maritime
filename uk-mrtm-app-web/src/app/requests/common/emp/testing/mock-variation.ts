import { produce } from 'immer';

import { EmpVariationDetails } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { mockEmpIssuanceSubmitRequestTask } from '@requests/common/emp/testing/mock-data';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const mockEmpVariationSaveApplicationRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        payloadType: 'EMP_VARIATION_SAVE_APPLICATION_PAYLOAD',
        empVariationDetailsCompleted: null,
        empVariationDetails: {},
        emissionsMonitoringPlan: {},
      } as EmpVariationTaskPayload,
    },
  },
};

export const mockEmpVariationDetails: EmpVariationDetails = {
  reason: 'Test reason',
  changes: ['CHANGE_EMP_HOLDER_NAME_OR_ADDRESS', 'ADD_NEW_FUELS_OR_EMISSION_SOURCES', 'REMOVING_SHIP'],
};

export const mockStateBuild = (
  variationDetails?: Partial<EmpVariationDetails>,
  variationDetailsStatus?: TaskItemStatus,
  data?: Partial<Record<keyof EmpVariationTaskPayload['emissionsMonitoringPlan'], any>>,
): RequestTaskState => {
  return {
    ...mockEmpIssuanceSubmitRequestTask,
    requestTaskItem: produce(mockEmpIssuanceSubmitRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as EmpVariationTaskPayload;

      payload.emissionsMonitoringPlan = { ...payload.emissionsMonitoringPlan, ...data };
      payload.empVariationDetails = { ...payload.empVariationDetails, ...variationDetails };
      payload.empVariationDetailsCompleted = variationDetailsStatus ?? payload.empVariationDetailsCompleted;
    }),
  };
};
