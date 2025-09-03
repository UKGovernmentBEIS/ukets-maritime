import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { OPERATOR_SUBTASKS, REPORTING_OBLIGATION_SUBTASKS } from '@requests/common/aer/aer-subtask-groups.const';
import { AER_SUBTASK_REVIEW_GROUP_MAP } from '@requests/common/aer/common';
import { ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';
import { AerAmendTaskPayload } from '@requests/tasks/aer-amend/aer-amend.types';
import { ReviewDecisionDto, ReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestTaskState, AerAmendTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload as AerAmendTaskPayload,
);

const selectReviewAttachments: StateSelector<RequestTaskState, AerAmendTaskPayload['reviewAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<RequestTaskState, { [key: string]: ReviewDecisionUnion }> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload?.reviewGroupDecisions as { [key: string]: ReviewDecisionUnion },
  );

const selectStatusForSubtask = (
  subtask: string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> =>
  createDescendingSelector(
    selectPayload,
    (payload) => (payload?.aerSectionsCompleted[subtask] ?? defaultStatus) as TaskItemStatus,
  );

const selectReviewDecisionsForAmends: StateSelector<
  RequestTaskState,
  Array<ReviewAmendDecisionDTO>
> = createAggregateSelector(
  selectReviewAttachments,
  requestTaskQuery.selectTasksDownloadUrl,
  selectReviewGroupDecisions,
  (attachments, downloadUrl, reviewGroupDecisions) => {
    const result: Array<{
      subtask: string;
      decision: ReviewDecisionDto;
    }> = [];
    const sections = [REPORTING_OBLIGATION_SUBTASKS, OPERATOR_SUBTASKS].flat();

    for (const section of sections) {
      const group = AER_SUBTASK_REVIEW_GROUP_MAP[section];
      const reviewGroupDecision = reviewGroupDecisions?.[group];
      if (reviewGroupDecision?.type !== 'OPERATOR_AMENDS_NEEDED') {
        continue;
      }

      result.push({
        subtask: section,
        decision: {
          type: reviewGroupDecision.type,
          details: {
            notes: reviewGroupDecision.details.notes,
            requiredChanges: reviewGroupDecision.details.requiredChanges.map((requiredChange) => ({
              reason: requiredChange.reason,
              files: requiredChange?.files?.map((file) => ({
                downloadUrl: `${downloadUrl}${file}`,
                fileName: attachments[file],
              })),
            })),
          },
        },
      });
    }

    return result;
  },
);

const selectSubtasksNeedAmends: StateSelector<RequestTaskState, Array<string>> = createDescendingSelector(
  selectReviewDecisionsForAmends,
  (reviewDecisions) => {
    return reviewDecisions.map((reviewDecision) => reviewDecision.subtask);
  },
);

const selectShouldSubmitToRegulator: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  aerCommonQuery.selectReportingRequired,
  selectPayload,
  (reportingRequired, payload) => reportingRequired === false || payload?.verificationPerformed === true,
);

export const aerAmendQuery = {
  selectPayload,
  selectReviewDecisionsForAmends,
  selectStatusForSubtask,
  selectSubtasksNeedAmends,
  selectShouldSubmitToRegulator,
};
