import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  FollowUpReviewApiService,
  FollowUpReviewService,
} from '@requests/tasks/notification-follow-up-review/services';
import {
  ReviewDecisionFlowManager,
  ReviewDecisionQuestionPayloadMutator,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';

export function provideFollowUpReviewPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReviewDecisionQuestionPayloadMutator },
  ]);
}

export function provideFollowUpReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: FollowUpReviewApiService },
    { provide: TaskService, useClass: FollowUpReviewService },
  ]);
}

export function provideFollowUpReviewSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([]);
}

export function provideFollowUpReviewStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ReviewDecisionFlowManager },
  ]);
}
