import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { WaitForAmendsTaskPayload } from '@requests/tasks/notification-wait-for-amends/wait-for-amends.types';
import { AttachedFile, FollowUpReviewDecisionDTO, FollowUpReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, WaitForAmendsTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as WaitForAmendsTaskPayload,
);

const selectReviewDecision: StateSelector<RequestTaskState, FollowUpReviewDecisionUnion> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reviewDecision as FollowUpReviewDecisionUnion,
);

const selectFollowUpResponseAttachments: StateSelector<
  RequestTaskState,
  WaitForAmendsTaskPayload['followUpResponseAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.followUpResponseAttachments);

const selectFollowUpReviewDecisionDTO: StateSelector<RequestTaskState, FollowUpReviewDecisionDTO> =
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectFollowUpResponseAttachments,
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
      notes: reviewDecision?.details?.notes,
    }),
  );

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectFollowUpResponseAttachments,
    (downloadUrl: string, attachments) =>
      files?.map((id) => ({
        downloadUrl: `${downloadUrl}${id}`,
        fileName: attachments[id],
      })),
  );

const selectFollowUpFiles: StateSelector<RequestTaskState, string[]> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.followUpFiles,
);

export const waitForAmendsQuery = {
  selectPayload,
  selectFollowUpReviewDecisionDTO,
  selectAttachedFiles,
  selectFollowUpFiles,
};
