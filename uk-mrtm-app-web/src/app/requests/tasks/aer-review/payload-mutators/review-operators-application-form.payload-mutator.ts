import { Provider } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PAYLOAD_MUTATORS, PayloadMutator } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { AerReviewWizardSteps } from '@requests/tasks/aer-review';
import { transformDecisionFormModelToDTO } from '@requests/tasks/aer-review/aer-review.helpers';
import { AerReviewTaskPayload, ReviewApplicationFormModel } from '@requests/tasks/aer-review/aer-review.types';
import { isNil } from '@shared/utils';

export const reviewOperatorsApplicationFormSubtaskPayloadMutator = (
  subtask: keyof AerReviewTaskPayload['aer'] | string,
): Provider => ({
  provide: PAYLOAD_MUTATORS,
  multi: true,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore) =>
    ({
      subtask: subtask,
      step: AerReviewWizardSteps.FORM,
      store: store,
      apply: (currentPayload: AerReviewTaskPayload, userInput: ReviewApplicationFormModel): Observable<any> => {
        return of(
          produce(currentPayload, (payload: AerReviewTaskPayload) => {
            const { group } = userInput;
            if (isNil(payload.reviewGroupDecisions)) {
              payload.reviewGroupDecisions = {};
            }

            payload.currentGroup = {
              group,
              decision: transformDecisionFormModelToDTO(userInput),
            };

            if (isNil(payload.aerSectionsCompleted)) {
              payload.aerSectionsCompleted = {};
            }

            payload.aerSectionsCompleted[subtask] = TaskItemStatus.IN_PROGRESS;
          }),
        );
      },
    }) as unknown as PayloadMutator,
});
