import { EmissionsMonitoringPlan } from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { EMP_SUBTASKS } from '@requests/common/emp/emp-subtasks.constant';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { EmpReturnedForAmendsPayload } from '@requests/timeline/emp-returned-for-amends/emp-returned-for-amends.types';
import { ReviewDecisionDto, ReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpReturnedForAmendsPayload> =
  timelineCommonQuery.selectPayload<EmpReturnedForAmendsPayload>();

const selectAmendsAttachments: StateSelector<RequestActionState, EmpReturnedForAmendsPayload['reviewAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<RequestActionState, { [key: string]: ReviewDecisionUnion }> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload.reviewGroupDecisions as { [key: string]: ReviewDecisionUnion },
  );

const selectAmendsDecisionsDTO: StateSelector<
  RequestActionState,
  Array<{
    subtask: keyof EmissionsMonitoringPlan;
    decision: ReviewDecisionDto;
  }>
> = createAggregateSelector(
  selectAmendsAttachments,
  timelineCommonQuery.selectDownloadUrl,
  selectReviewGroupDecisions,
  (attachments, downloadUrl, decisions) => {
    const result: Array<{
      subtask: keyof EmissionsMonitoringPlan;
      decision: ReviewDecisionDto;
    }> = [];

    for (const section of EMP_SUBTASKS) {
      const group = subtaskReviewGroupMap[section];
      const reviewGroupDecision = decisions?.[group];

      if (reviewGroupDecision?.type !== 'OPERATOR_AMENDS_NEEDED') {
        continue;
      }

      result.push({
        subtask: section,
        decision: {
          type: reviewGroupDecision?.type,
          details: {
            requiredChanges: reviewGroupDecision?.details?.requiredChanges?.map((change) => ({
              reason: change?.reason,
              files: timelineUtils.getAttachedFiles(change?.files, attachments, downloadUrl),
            })),
            notes: reviewGroupDecision?.details?.notes,
          },
        },
      });
    }

    return result;
  },
);

export const empReturnedForAmendsQuery = {
  selectReviewGroupDecisions,
  selectAmendsDecisionsDTO,
};
