import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmissionsMonitoringPlan, EmpIssuanceReviewDecision } from '@mrtm/api';

import { EmpReviewTaskPayload, TaskItemStatus } from '@requests/common';
import { OVERALL_DECISION_SUB_TASK } from '@requests/common/emp/subtasks/overall-decision';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { ReviewDecisionFormModel } from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewDecisionUnion } from '@shared/types';
import { transformToTaskAttachments } from '@shared/utils';

const transformReviewDecision = (userInput: ReviewDecisionFormModel['value']): EmpReviewDecisionUnion => ({
  type: userInput.type,
  details: {
    notes: userInput.notes,
    ...(userInput.type === 'OPERATOR_AMENDS_NEEDED'
      ? {
          requiredChanges: userInput.requiredChanges.map((requiredChange) => ({
            reason: requiredChange.reason,
            files: requiredChange.files.map((file) => file.uuid),
          })),
        }
      : null),
  },
});

/**
 * Delete determination and its sectionsComplete if is APPROVED
 */
export const applyReviewDecisionMutator =
  (subtask: keyof EmissionsMonitoringPlan) =>
  (
    currentPayload: EmpReviewTaskPayload,
    userInput: ReviewDecisionFormModel['value'],
  ): Observable<EmpReviewTaskPayload> => {
    return of(
      produce(currentPayload, (payload) => {
        const totalFiles = userInput?.requiredChanges?.map((change) => change?.files).flat();

        payload.reviewGroupDecisions[subtaskReviewGroupMap[subtask]] = transformReviewDecision(
          userInput,
        ) as EmpIssuanceReviewDecision;
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
