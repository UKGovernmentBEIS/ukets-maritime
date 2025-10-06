import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { timelineCommonQuery, timelineUtils } from '@requests/common';
import { EMP_SUBTASKS } from '@requests/common/emp/emp-subtasks.constant';
import { ReviewAmendDecisionDTO } from '@requests/common/emp/return-for-amends';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { EmpVariationReturnedForAmendsActionPayload } from '@requests/timeline/emp-variation-returned-for-amends/emp-variation-returned-for-amends.type';
import { EmpVariationReviewDecisionUnion } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpVariationReturnedForAmendsActionPayload> =
  timelineCommonQuery.selectPayload<EmpVariationReturnedForAmendsActionPayload>();

const selectAmendsAttachments: StateSelector<
  RequestActionState,
  EmpVariationReturnedForAmendsActionPayload['reviewAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<
  RequestActionState,
  Record<string, EmpVariationReviewDecisionUnion>
> = createDescendingSelector(
  selectPayload,
  (payload) => payload.reviewGroupDecisions as { [key: string]: EmpVariationReviewDecisionUnion },
);

const selectAmendsDecisionsDTO: StateSelector<
  RequestActionState,
  Array<ReviewAmendDecisionDTO>
> = createAggregateSelector(
  selectAmendsAttachments,
  timelineCommonQuery.selectDownloadUrl,
  selectPayload,
  (attachments, downloadUrl, payload) => {
    const decisions = payload?.reviewGroupDecisions as { [key: string]: EmpVariationReviewDecisionUnion };
    const variationDetailsDecision = payload?.empVariationDetailsReviewDecision as EmpVariationReviewDecisionUnion;

    const result: Array<ReviewAmendDecisionDTO> = [];

    if (variationDetailsDecision?.type === 'OPERATOR_AMENDS_NEEDED') {
      result.push({
        subtask: VARIATION_DETAILS_SUB_TASK,
        decision: {
          type: variationDetailsDecision?.type,
          details: {
            requiredChanges: variationDetailsDecision?.details?.requiredChanges?.map((decision) => ({
              reason: decision?.reason,
              files:
                decision?.files?.map((id) => ({
                  downloadUrl: downloadUrl + `${id}`,
                  fileName: attachments[id],
                })) ?? [],
            })),
          },
        },
      });
    }

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

export const empVariationReturnedForAmendsQuery = {
  selectReviewGroupDecisions,
  selectAmendsDecisionsDTO,
};
