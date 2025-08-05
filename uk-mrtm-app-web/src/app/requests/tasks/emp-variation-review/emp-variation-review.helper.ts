import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmissionsMonitoringPlan, EmpVariationReviewDecision } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { OVERALL_DECISION_SUB_TASK } from '@requests/common/emp/subtasks/overall-decision';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewDecisionUnion } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

const reviewDetailsMutationMap: Record<
  EmpVariationReviewDecisionUnion['type'],
  (value: ReviewDecisionFormModel['value']) => Partial<EmpVariationReviewDecisionUnion['details']>
> = {
  ACCEPTED: (userInput) => ({ notes: userInput.notes, variationScheduleItems: userInput.variationScheduleItems }),
  REJECTED: (userInput) => ({ notes: userInput.notes }),
  OPERATOR_AMENDS_NEEDED: (userInput) => ({
    notes: userInput.notes,
    requiredChanges: userInput.requiredChanges.map((requiredChange) => ({
      reason: requiredChange.reason,
      files: requiredChange.files.map((file) => file.uuid),
    })),
  }),
};

const transformReviewDecision = (userInput: ReviewDecisionFormModel['value']): EmpVariationReviewDecisionUnion => ({
  type: userInput.type,
  details: reviewDetailsMutationMap[userInput.type](userInput) as EmpVariationReviewDecisionUnion['details'],
});

/**
 * Delete determination and its sectionsComplete if is APPROVED
 */
export const applyReviewDecisionMutator =
  (subtask: keyof EmissionsMonitoringPlan) =>
  (
    currentPayload: EmpVariationReviewTaskPayload,
    userInput: ReviewDecisionFormModel['value'],
  ): Observable<EmpVariationReviewTaskPayload> => {
    return of(
      produce(currentPayload, (payload) => {
        const totalFiles = userInput?.requiredChanges?.map((change) => change?.files).flat();

        payload.reviewGroupDecisions[subtaskReviewGroupMap[subtask]] = transformReviewDecision(
          userInput,
        ) as EmpVariationReviewDecision;
        payload.reviewAttachments = {
          ...payload.reviewAttachments,
          ...transformToTaskAttachments(totalFiles),
        };
        payload.empSectionsCompleted[subtask] = TaskItemStatus.IN_PROGRESS;
        if (currentPayload?.determination?.type === TaskItemStatus.APPROVED) {
          delete payload.determination;
          delete payload.empSectionsCompleted[OVERALL_DECISION_SUB_TASK];
        }
      }),
    );
  };

export const applyVariationDetailsReviewDecisionMutator = (
  currentPayload: EmpVariationReviewTaskPayload,
  userInput: ReviewDecisionFormModel['value'],
): Observable<EmpVariationReviewTaskPayload> => {
  return of(
    produce(currentPayload, (payload) => {
      const totalFiles = userInput?.requiredChanges?.map((change) => change?.files).flat();

      payload.empVariationDetailsReviewDecision = transformReviewDecision(userInput) as EmpVariationReviewDecision;
      payload.reviewAttachments = {
        ...payload.reviewAttachments,
        ...transformToTaskAttachments(totalFiles),
      };
      payload.empVariationDetailsReviewCompleted = TaskItemStatus.IN_PROGRESS;
      payload.empVariationDetailsCompleted = TaskItemStatus.IN_PROGRESS;

      if (currentPayload?.determination?.type === TaskItemStatus.APPROVED) {
        delete payload.determination;
        delete payload.empSectionsCompleted[OVERALL_DECISION_SUB_TASK];
      }
    }),
  );
};
