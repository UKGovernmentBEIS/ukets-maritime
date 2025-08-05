import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { FollowUpApiService, FollowUpService } from '@requests/tasks/notification-follow-up/services';
import { FollowUpResponseFlowManager } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.flow-manager';
import { FollowUpResponsePayloadMutator } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response/follow-up-response.payload-mutator';
import { FollowUpResponseSummarySideEffect } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response-summary/follow-up-response-summary-side-effect';

export function provideFollowUpPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: FollowUpResponsePayloadMutator },
  ]);
}

export function provideFollowUpTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: FollowUpApiService },
    { provide: TaskService, useClass: FollowUpService },
  ]);
}

export const provideFollowUpSideEffects = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: SIDE_EFFECTS, multi: true, useClass: FollowUpResponseSummarySideEffect }]);

export function provideFollowUpStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: FollowUpResponseFlowManager },
  ]);
}
