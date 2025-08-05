import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpReviewTaskPayload, EmpTaskPayload, TaskItemStatus } from '@requests/common';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionActionsPayloadMutator extends PayloadMutator {
  subtask = OVERALL_DECISION_SUB_TASK;
  step = OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS;

  override apply(
    currentPayload: EmpReviewTaskPayload,
    userInput: EmpIssuanceDetermination['type'],
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.determination = {
          type: userInput,
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
