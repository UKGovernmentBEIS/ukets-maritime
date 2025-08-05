import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpReviewTaskPayload, EmpTaskPayload } from '@requests/common';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionReviewSummaryPayloadMutator extends PayloadMutator {
  subtask = OVERALL_DECISION_SUB_TASK;
  step = OverallDecisionWizardStep.SUMMARY;

  override apply(
    currentPayload: EmpReviewTaskPayload,
    userInput: EmpIssuanceDetermination,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.determination = userInput;
        delete payload.empSectionsCompleted[this.subtask];
      }),
    );
  }
}
