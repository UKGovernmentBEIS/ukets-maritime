import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import { FollowUpResponseDTO, FollowUpReviewDecisionDTO, FollowUpReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, FollowUpReviewTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as FollowUpReviewTaskPayload,
);

const selectSectionsCompleted: StateSelector<RequestTaskState, FollowUpReviewTaskPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (subtask: string): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    selectSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.UNDECIDED,
  );
};

const selectReviewDecision: StateSelector<RequestTaskState, FollowUpReviewDecisionUnion> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reviewDecision as FollowUpReviewDecisionUnion,
);

const selectIsSubtaskCompleted = (subtask: string): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(selectSectionsCompleted, (completed) => {
    const taskStatus = completed?.[subtask] as TaskItemStatus;
    return taskStatus === TaskItemStatus.ACCEPTED || taskStatus === TaskItemStatus.AMENDS_NEEDED;
  });
};

const selectFollowUpAttachments: StateSelector<RequestTaskState, FollowUpReviewTaskPayload['followUpAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.followUpAttachments);

const selectFollowUpReviewDecisionDTO: StateSelector<RequestTaskState, FollowUpReviewDecisionDTO> =
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectFollowUpAttachments,
    selectReviewDecision,
    (downloadUrl, followUpAttachments, reviewDecision) => ({
      type: reviewDecision?.type,
      requiredChanges: reviewDecision?.details?.requiredChanges?.map((change) => ({
        reason: change?.reason,
        files:
          change?.files?.map((id) => ({
            downloadUrl: downloadUrl + `${id}`,
            fileName: followUpAttachments[id],
          })) ?? [],
      })),
      notes: reviewDecision?.details?.notes,
      dueDate: reviewDecision?.details?.dueDate,
    }),
  );

const selectFollowUpResponseDTO: StateSelector<RequestTaskState, FollowUpResponseDTO> = createAggregateSelector(
  empCommonQuery.selectTasksDownloadUrl,
  selectPayload,
  (downloadUrl, payload) => ({
    followUpRequest: payload?.followUpRequest,
    followUpResponseExpirationDate: payload?.followUpResponseExpirationDate,
    submissionDate: payload?.submissionDate,
    followUpResponse: payload?.followUpResponse,
    attachments:
      payload?.followUpFiles?.map((id) => ({
        downloadUrl: downloadUrl + `${id}`,
        fileName: payload?.followUpAttachments[id],
      })) ?? [],
  }),
);

export const followUpReviewQuery = {
  selectPayload,
  selectStatusForSubtask,
  selectIsSubtaskCompleted,
  selectFollowUpResponseDTO,
  selectReviewDecision,
  selectFollowUpReviewDecisionDTO,
  selectFollowUpAttachments,
};
