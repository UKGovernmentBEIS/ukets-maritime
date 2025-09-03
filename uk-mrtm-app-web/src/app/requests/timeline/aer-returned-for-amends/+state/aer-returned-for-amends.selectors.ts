import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { OPERATOR_SUBTASKS, REPORTING_OBLIGATION_SUBTASKS } from '@requests/common/aer/aer-subtask-groups.const';
import { AER_SUBTASK_REVIEW_GROUP_MAP } from '@requests/common/aer/common';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AerReturnedForAmendsActionPayload } from '@requests/timeline/aer-returned-for-amends/aer-returned-for-amends.type';
import { ReviewDecisionDto } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, AerReturnedForAmendsActionPayload> =
  timelineCommonQuery.selectPayload<AerReturnedForAmendsActionPayload>();

const selectAmendsAttachments: StateSelector<
  RequestActionState,
  AerReturnedForAmendsActionPayload['reviewAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload.reviewAttachments);

const selectAmendsDecisions: StateSelector<
  RequestActionState,
  Array<{
    subtask: string;
    decision: ReviewDecisionDto;
  }>
> = createAggregateSelector(
  selectAmendsAttachments,
  timelineCommonQuery.selectDownloadUrl,
  aerTimelineCommonQuery.selectReviewGroupDecisions,
  (attachments, downloadUrl, reviewGroupDecisions) => {
    const result: Array<{
      subtask: string;
      decision: ReviewDecisionDto;
    }> = [];

    for (const section of [REPORTING_OBLIGATION_SUBTASKS, OPERATOR_SUBTASKS].flat()) {
      const group = AER_SUBTASK_REVIEW_GROUP_MAP[section];
      const reviewGroupDecision = reviewGroupDecisions?.[group];

      if (reviewGroupDecision?.type !== 'OPERATOR_AMENDS_NEEDED') {
        continue;
      }

      result.push({
        subtask: section,
        decision: {
          type: reviewGroupDecision?.type,
          details: {
            requiredChanges: reviewGroupDecision?.details?.requiredChanges?.map((requiredChange) => ({
              reason: requiredChange?.reason,
              files: timelineUtils.getAttachedFiles(requiredChange?.files, attachments, downloadUrl),
            })),
            notes: reviewGroupDecision?.details?.notes,
          },
        },
      });
    }

    return result;
  },
);

export const aerReturnedForAmendsQuery = {
  selectAmendsDecisions,
};
