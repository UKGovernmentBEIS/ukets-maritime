import { Provider } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { concatMap, map, Observable, of } from 'rxjs';

import { WIZARD_FLOW_MANAGERS, WizardFlowManager } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';

import { AerReviewWizardSteps } from '@requests/tasks/aer-review';
import { AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export const provideReviewOperatorsApplicationFlowManager = (
  subtask: keyof AerReviewTaskPayload['aer'] | string,
): Provider => ({
  provide: WIZARD_FLOW_MANAGERS,
  multi: true,
  deps: [RequestTaskStore, Router],
  useFactory: (store: RequestTaskStore, router: Router) => {
    const nextStepPath = (currentStep: string): Observable<string> => {
      switch (currentStep) {
        case AerReviewWizardSteps.FORM:
          return of(AerReviewWizardSteps.SUMMARY);
        case AerReviewWizardSteps.SUMMARY:
        default:
          return of('../../../');
      }
    };

    return {
      subtask: subtask,
      store: store,
      router: router,
      nextStep: (currentStep: string, route: ActivatedRoute): Observable<string> => {
        return nextStepPath(currentStep).pipe(
          concatMap((path) => {
            return fromPromise(router.navigate([path], { relativeTo: route })).pipe(map(() => path));
          }),
        );
      },
    } as unknown as WizardFlowManager;
  },
});
