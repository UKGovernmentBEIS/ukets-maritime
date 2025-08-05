import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';
import { isNil } from 'lodash-es';

import { AerDataReviewDecision } from '@mrtm/api';

import { PAYLOAD_MUTATORS, PayloadMutator } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { AerReviewWizardSteps } from '@requests/tasks/aer-review';
import { AerReviewTaskPayload, ReviewApplicationFormModel } from '@requests/tasks/aer-review/aer-review.types';

export const reviewOperatorsApplicationSummarySubtaskPayloadMutator = (
  subtask: keyof AerReviewTaskPayload['aer'] | string,
): Provider => ({
  provide: PAYLOAD_MUTATORS,
  multi: true,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore) =>
    ({
      subtask: subtask,
      step: AerReviewWizardSteps.SUMMARY,
      store: store,
      apply: (currentPayload: AerReviewTaskPayload, group: ReviewApplicationFormModel['group']): Observable<any> => {
        return of(
          produce(currentPayload, (payload: AerReviewTaskPayload) => {
            payload.currentGroup = {
              group,
              decision: payload.reviewGroupDecisions?.[group] as AerDataReviewDecision,
            };

            if (isNil(payload.aerSectionsCompleted)) {
              payload.aerSectionsCompleted = {};
            }

            payload.aerSectionsCompleted[subtask] =
              payload?.currentGroup?.decision?.type === 'ACCEPTED'
                ? TaskItemStatus.ACCEPTED
                : TaskItemStatus.OPERATOR_AMENDS_NEEDED;
          }),
        );
      },
    }) as unknown as PayloadMutator,
});
