import { produce } from 'immer';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { NotificationReviewDecisionUnion } from '@shared/types';

export const mockReviewDecision: NotificationReviewDecisionUnion = {
  type: 'ACCEPTED',
  details: {
    followUp: {
      followUpResponseRequired: true,
      followUpRequest: 'some followup request',
      followUpResponseExpirationDate: new Date('2050-10-31') as unknown as string,
    },
    officialNotice: 'some summary',
    notes: 'some notes',
  },
};

export const mockNotificationReviewRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        payloadType: 'EMP_NOTIFICATION_APPLICATION_REVIEW_PAYLOAD',
        emissionsMonitoringPlanNotification: {
          detailsOfChange: {
            description: 'description the non-significant change',
            justification: 'some justification',
            startDate: '2020-04-01',
            endDate: '2023-03-01',
            documents: [
              '11111111-1111-4111-a111-111111111111',
              '22222222-2222-4222-a222-222222222222',
              '33333333-3333-4333-a333-333333333333',
            ],
          },
        },
        empNotificationAttachments: {
          '11111111-1111-4111-a111-111111111111': '1.png',
          '22222222-2222-4222-a222-222222222222': '2.png',
          '33333333-3333-4333-a333-333333333333': '3.png',
        },
        reviewDecision: {},
        rfiAttachments: {},
      } as unknown as ReviewTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: NotificationReviewDecisionUnion,
  taskStatus?: Record<'detailsChange', TaskItemStatus>,
): RequestTaskState => {
  return {
    ...mockNotificationReviewRequestTask,
    requestTaskItem: produce(mockNotificationReviewRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as ReviewTaskPayload;

      payload.reviewDecision = data;
      payload.sectionsCompleted = { ...taskStatus };
    }),
  };
};
