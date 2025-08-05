import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmissionsMonitoringPlan, EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload } from '@mrtm/api';

import { SIDE_EFFECTS, SideEffect } from '@netz/common/forms';

import { subtaskReviewGroupMap } from '@requests/common/emp/utils/subtask-review-group.map';

export const provideEmpAmendResetReviewDecisionSubtaskSideEffect = (
  empSubtask: keyof EmissionsMonitoringPlan,
): Provider => ({
  provide: SIDE_EFFECTS,
  multi: true,
  useFactory: () => {
    return {
      subtask: empSubtask,
      step: undefined,
      on: ['SUBMIT_SUBTASK'],

      apply: (currentPayload: any): Observable<any> => {
        return of(
          produce(currentPayload, (payload) => {
            delete payload?.empSectionsCompleted?.[empSubtask];
            payload.updatedSubtasks = [
              ...new Set<EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload['reviewGroup']>([
                ...(payload?.updatedSubtasks ?? []),
                subtaskReviewGroupMap[empSubtask],
              ]),
            ];
          }),
        );
      },
    } as SideEffect;
  },
});
