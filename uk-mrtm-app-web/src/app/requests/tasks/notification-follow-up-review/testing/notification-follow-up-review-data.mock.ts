import { produce } from 'immer';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import { FollowUpReviewDecisionUnion } from '@shared/types';

export const mockFollowUpReviewDecision: FollowUpReviewDecisionUnion = {
  type: 'AMENDS_NEEDED',
  details: {
    notes: 'Some notes',
    requiredChanges: [
      {
        reason: 'Some changes 1',
        files: ['11111111-1111-4111-a111-111111111111', '22222222-2222-4222-a222-222222222222'],
      },
      {
        reason: 'Some changes 2',
        files: [],
      },
    ],
    dueDate: new Date('2050-10-31') as unknown as string,
  },
};

export const mockNotificationFollowUpReviewRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      payload: {
        payloadType: 'EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW_PAYLOAD',
        followUpRequest: 'some changes here',
        followUpResponseExpirationDate: '2026-01-01',
        followUpResponse: 'Some response',
        followUpFiles: ['33333333-3333-4333-a333-333333333333', '44444444-4444-4444-a444-444444444444'],
        followUpAttachments: {
          '11111111-1111-4111-a111-111111111111': '1.png',
          '22222222-2222-4222-a222-222222222222': '2.png',
          '33333333-3333-4333-a333-333333333333': '3.png',
          '44444444-4444-4444-a444-444444444444': '4.png',
        },
        submissionDate: '2024-10-01',
        reviewDecision: {},
        sectionsCompleted: {},
      } as unknown as FollowUpReviewTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: FollowUpReviewDecisionUnion,
  taskStatus?: Record<'reviewDecision', TaskItemStatus>,
): RequestTaskState => {
  return {
    ...mockNotificationFollowUpReviewRequestTask,
    requestTaskItem: produce(mockNotificationFollowUpReviewRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as FollowUpReviewTaskPayload;

      payload.reviewDecision = data;
      payload.sectionsCompleted = { ...taskStatus };
    }),
  };
};
