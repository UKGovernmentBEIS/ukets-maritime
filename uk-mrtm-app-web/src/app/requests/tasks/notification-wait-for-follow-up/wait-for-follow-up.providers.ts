import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { WaitForFollowUpApiService } from '@requests/tasks/notification-wait-for-follow-up/services/wait-for-follow-up.api.service';
import { WaitForFollowUpService } from '@requests/tasks/notification-wait-for-follow-up/services/wait-for-follow-up.service';
import { EditDueDateFlowManager } from '@requests/tasks/notification-wait-for-follow-up/subtasks/edit-due-date/edit-due-date.flow-manager';
import { EditDueDatePayloadMutator } from '@requests/tasks/notification-wait-for-follow-up/subtasks/edit-due-date/edit-due-date.payload-mutator';

export function provideWaitForFollowUpTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: WaitForFollowUpApiService },
    { provide: TaskService, useClass: WaitForFollowUpService },
  ]);
}

export function provideWaitForFollowUpStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EditDueDateFlowManager }]);
}

export function provideWaitForFollowUpPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: EditDueDatePayloadMutator }]);
}
