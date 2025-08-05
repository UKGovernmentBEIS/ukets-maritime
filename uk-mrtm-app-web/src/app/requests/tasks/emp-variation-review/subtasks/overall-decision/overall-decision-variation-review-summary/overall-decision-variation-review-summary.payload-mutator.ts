import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpVariationDetermination } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { OVERALL_DECISION_SUB_TASK, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';

export class OverallDecisionVariationReviewSummaryPayloadMutator extends PayloadMutator {
  subtask = OVERALL_DECISION_SUB_TASK;
  step = OverallDecisionWizardStep.SUMMARY;

  override apply(
    currentPayload: EmpVariationReviewTaskPayload,
    userInput: EmpVariationDetermination,
  ): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.determination = userInput;
        delete payload.empSectionsCompleted[this.subtask];
      }),
    );
  }
}
