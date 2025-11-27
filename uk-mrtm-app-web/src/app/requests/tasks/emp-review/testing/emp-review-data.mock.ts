import { produce } from 'immer';

import { EmpIssuanceDetermination, EmpIssuanceReviewDecision } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { EmpReviewTaskPayload } from '@requests/common';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const mockEmpIssuanceReviewRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'EMP_ISSUANCE_APPLICATION_REVIEW',
      payload: {
        payloadType: 'EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD',
        emissionsMonitoringPlan: {},
        empSectionsCompleted: {},
        empAttachments: {},
        reviewGroupDecisions: {},
        reviewAttachments: {},
        determination: {},
        rfiAttachments: {},
      } as EmpReviewTaskPayload,
    },
  },
};

export const mockEmpReviewStateBuild = (
  data?: Partial<Record<keyof EmpReviewTaskPayload['emissionsMonitoringPlan'], any>>,
  taskStatus?: Partial<
    | Record<keyof EmpReviewTaskPayload['emissionsMonitoringPlan'], TaskItemStatus>
    | Record<'overallDecision', TaskItemStatus>
  >,
  empAttachments?: EmpReviewTaskPayload['empAttachments'],
  reviewGroupDecisions?: { [key: string]: EmpIssuanceReviewDecision },
  reviewAttachments?: { [key: string]: string },
  determination?: EmpIssuanceDetermination,
): RequestTaskState => {
  return {
    ...mockEmpIssuanceReviewRequestTask,
    requestTaskItem: produce(mockEmpIssuanceReviewRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as EmpReviewTaskPayload;

      payload.emissionsMonitoringPlan = { ...payload.emissionsMonitoringPlan, ...data };
      payload.empSectionsCompleted = { ...payload.empSectionsCompleted, ...taskStatus };
      payload.empAttachments = { ...payload.empAttachments, ...empAttachments };
      payload.reviewGroupDecisions = { ...payload.reviewGroupDecisions, ...reviewGroupDecisions };
      payload.reviewAttachments = { ...payload.reviewAttachments, ...reviewAttachments };
      payload.determination = { ...payload.determination, ...determination };
    }),
  };
};
