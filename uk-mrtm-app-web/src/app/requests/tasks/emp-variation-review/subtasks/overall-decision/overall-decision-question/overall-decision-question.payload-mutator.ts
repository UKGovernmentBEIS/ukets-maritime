import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpVariationDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload, TaskItemStatus } from '@requests/common';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionQuestionPayloadMutator extends PayloadMutator {
  subtask = OVERALL_DECISION_SUB_TASK;
  step = OverallDecisionWizardStep.OVERALL_DECISION_QUESTION;

  override apply(
    currentPayload: EmpVariationReviewTaskPayload,
    userInput: Pick<EmpVariationDetermination, 'reason'>,
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
