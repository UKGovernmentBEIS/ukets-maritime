import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpReviewTaskPayload, EmpTaskPayload, TaskItemStatus } from '@requests/common';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionQuestionPayloadMutator extends PayloadMutator {
  subtask = OVERALL_DECISION_SUB_TASK;
  step = OverallDecisionWizardStep.OVERALL_DECISION_QUESTION;

  override apply(
    currentPayload: EmpReviewTaskPayload,
    userInput: Pick<EmpIssuanceDetermination, 'reason'>,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.determination = {
          type: currentPayload?.determination?.type,
          reason: userInput?.reason,
        };
        payload.empSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
