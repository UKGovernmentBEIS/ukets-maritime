import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery, TaskItemStatus } from '@requests/common';
import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';
import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';
import { SUBMIT_TO_REGULATOR_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit';
import { FOLLOW_UP_RESPONSE_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { AttachedFile, FollowUpReviewDecisionDTO, FollowUpReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, FollowUpAmendTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as FollowUpAmendTaskPayload,
);

const selectSectionsCompleted: StateSelector<RequestTaskState, FollowUpAmendTaskPayload['sectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.sectionsCompleted);

const selectStatusForSubtask = (
  subtask: typeof AMENDS_DETAILS_SUB_TASK | typeof FOLLOW_UP_RESPONSE_SUB_TASK | typeof SUBMIT_TO_REGULATOR_SUB_TASK,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(selectSectionsCompleted, (completed) => {
    if (completed?.[subtask]) {
      return completed[subtask] as TaskItemStatus;
    }
    switch (subtask) {
      case AMENDS_DETAILS_SUB_TASK:
        return TaskItemStatus.NOT_STARTED;
      case FOLLOW_UP_RESPONSE_SUB_TASK:
        return TaskItemStatus.COMPLETED;
      case SUBMIT_TO_REGULATOR_SUB_TASK:
        if (
          completed?.[AMENDS_DETAILS_SUB_TASK] === TaskItemStatus.COMPLETED &&
          (!completed?.[FOLLOW_UP_RESPONSE_SUB_TASK] ||
            completed?.[FOLLOW_UP_RESPONSE_SUB_TASK] === TaskItemStatus.COMPLETED)
        ) {
          return TaskItemStatus.NOT_STARTED;
        }
        return TaskItemStatus.CANNOT_START_YET;
    }
  });
};

const selectReviewDecision: StateSelector<RequestTaskState, FollowUpReviewDecisionUnion> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reviewDecision as FollowUpReviewDecisionUnion,
);

const selectFollowUpAttachments: StateSelector<RequestTaskState, FollowUpAmendTaskPayload['followUpAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.followUpAttachments);

const selectFollowUpReviewDecisionDTO: StateSelector<
  RequestTaskState,
  Pick<FollowUpReviewDecisionDTO, 'requiredChanges' | 'dueDate'>
> = createAggregateSelector(
  empCommonQuery.selectTasksDownloadUrl,
  selectFollowUpAttachments,
  selectReviewDecision,
  (downloadUrl, followUpAttachments, reviewDecision) => ({
    requiredChanges: reviewDecision?.details?.requiredChanges?.map((change) => ({
      reason: change?.reason,
      files:
        change?.files?.map((id) => ({
          downloadUrl: downloadUrl + `${id}`,
          fileName: followUpAttachments[id],
        })) ?? [],
    })),
    dueDate: reviewDecision?.details?.dueDate,
  }),
);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(empCommonQuery.selectTasksDownloadUrl, selectPayload, (downloadUrl: string, payload) =>
    files?.map((id) => ({
      downloadUrl: `${downloadUrl}${id}`,
      fileName: payload?.followUpAttachments[id],
    })),
  );

const selectFollowUpFiles: StateSelector<RequestTaskState, string[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.followUpFiles,
);

export const followUpAmendQuery = {
  selectPayload,
  selectStatusForSubtask,
  selectReviewDecision,
  selectFollowUpReviewDecisionDTO,
  selectFollowUpAttachments,
  selectSectionsCompleted,
  selectAttachedFiles,
  selectFollowUpFiles,
};
