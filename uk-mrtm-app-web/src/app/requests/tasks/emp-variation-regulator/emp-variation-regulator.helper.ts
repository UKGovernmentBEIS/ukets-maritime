import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmissionsMonitoringPlan, EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import { EmpVariationRegulatorTaskPayload, TaskItemStatus } from '@requests/common';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { VariationRegulatorDecisionFormModel } from '@requests/tasks/emp-variation-regulator/components';

const transformVariationRegulatorDecision = (
  userInput: VariationRegulatorDecisionFormModel['value'],
): EmpAcceptedVariationDecisionDetails => ({
  notes: userInput.notes,
  variationScheduleItems: userInput?.variationScheduleItems
    ? userInput?.variationScheduleItems.map((scheduleItem) => scheduleItem.item)
    : [],
});

export const applyVariationRegulatorDecisionMutator =
  (subtask: keyof EmissionsMonitoringPlan) =>
  (
    currentPayload: EmpVariationRegulatorTaskPayload,
    userInput: VariationRegulatorDecisionFormModel['value'],
  ): Observable<EmpVariationRegulatorTaskPayload> => {
    return of(
      produce(currentPayload, (payload) => {
        payload.reviewGroupDecisions[subtaskReviewGroupMap[subtask]] = transformVariationRegulatorDecision(userInput);
        payload.empSectionsCompleted[subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  };
