import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { FollowUpAmendApiService, FollowUpAmendService } from '@requests/tasks/notification-follow-up-amend/services';
import { AmendsDetailsFlowManager } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.flow-manager';
import { AmendsDetailsSideEffect } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details-side-effect';
import { ResponseFlowManager } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.flow-manager';
import { ResponsePayloadMutator } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response/response.payload-mutator';
import { ResponseSummarySideEffect } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response-summary/response-summary-side-effect';

export function provideFollowUpAmendPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: ResponsePayloadMutator }]);
}

export function provideFollowUpAmendTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: FollowUpAmendApiService },
    { provide: TaskService, useClass: FollowUpAmendService },
  ]);
}

export function provideFollowUpAmendSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: ResponseSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: AmendsDetailsSideEffect },
  ]);
}

export function provideFollowUpAmendStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ResponseFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: AmendsDetailsFlowManager },
  ]);
}
