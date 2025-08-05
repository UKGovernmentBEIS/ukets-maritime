import { produce } from 'immer';

import {
  EmissionsMonitoringPlanContainer,
  EmpAcceptedVariationDecisionDetails,
  EmpVariationDetails,
  EmpVariationRegulatorLedReason,
} from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { EmpVariationRegulatorTaskPayload } from '@requests/common';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const mockEmpVariationRegulatorRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'EMP_VARIATION_SAVE_APPLICATION_REGULATOR_LED',
      payload: {
        payloadType: 'EMP_VARIATION_SAVE_APPLICATION_REGULATOR_LED_PAYLOAD',
        emissionsMonitoringPlan: {},
        empVariationDetails: {},
        empVariationDetailsCompleted: null,
        empAttachments: {},
        empSectionsCompleted: {},
        originalEmpContainer: {},
        reasonRegulatorLed: {},
        reviewGroupDecisions: {},
      } as EmpVariationRegulatorTaskPayload,
    },
  },
};

export const mockEmpVariationRegulatorStateBuild = (
  data?: Partial<Record<keyof EmpVariationRegulatorTaskPayload['emissionsMonitoringPlan'], any>>,
  taskStatus?: Partial<Record<keyof EmpVariationRegulatorTaskPayload['emissionsMonitoringPlan'], TaskItemStatus>>,
  empAttachments?: EmpVariationRegulatorTaskPayload['empAttachments'],
  originalData?: Partial<EmissionsMonitoringPlanContainer>,
  reviewGroupDecisions?: { [key: string]: EmpAcceptedVariationDecisionDetails },
  empVariationDetails?: EmpVariationDetails,
  reasonRegulatorLed?: EmpVariationRegulatorLedReason,
): RequestTaskState => {
  return {
    ...mockEmpVariationRegulatorRequestTask,
    requestTaskItem: produce(mockEmpVariationRegulatorRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as EmpVariationRegulatorTaskPayload;

      payload.emissionsMonitoringPlan = { ...payload.emissionsMonitoringPlan, ...data };
      payload.originalEmpContainer = { ...payload.originalEmpContainer, ...originalData };
      payload.empSectionsCompleted = { ...payload.empSectionsCompleted, ...taskStatus };
      payload.empAttachments = { ...payload.empAttachments, ...empAttachments };
      payload.reviewGroupDecisions = { ...payload.reviewGroupDecisions, ...reviewGroupDecisions };
      payload.empVariationDetails = { ...payload.empVariationDetails, ...empVariationDetails };
      payload.reasonRegulatorLed = { ...payload.reasonRegulatorLed, ...reasonRegulatorLed };
    }),
  };
};
