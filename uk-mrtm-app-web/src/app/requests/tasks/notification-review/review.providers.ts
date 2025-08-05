import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { ReviewApiService, ReviewService } from '@requests/tasks/notification-review/services';
import {
  DetailsChangeDecisionPayloadMutator,
  DetailsChangeFlowManager,
  DetailsChangeSummarySideEffect,
} from '@requests/tasks/notification-review/subtasks/details-change';

export function provideReviewPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DetailsChangeDecisionPayloadMutator },
  ]);
}

export function provideReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: ReviewApiService },
    { provide: TaskService, useClass: ReviewService },
  ]);
}

export function provideReviewSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SIDE_EFFECTS, multi: true, useClass: DetailsChangeSummarySideEffect }]);
}

export function provideReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DetailsChangeFlowManager }]);
}
