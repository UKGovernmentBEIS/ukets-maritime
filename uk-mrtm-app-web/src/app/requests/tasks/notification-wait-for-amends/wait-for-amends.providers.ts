import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { WaitForAmendsApiService, WaitForAmendsService } from '@requests/tasks/notification-wait-for-amends/services';
import { EditDueDateFlowManager } from '@requests/tasks/notification-wait-for-amends/subtasks/edit-due-date/edit-due-date.flow-manager';
import { EditDueDatePayloadMutator } from '@requests/tasks/notification-wait-for-amends/subtasks/edit-due-date/edit-due-date.payload-mutator';

export function provideWaitForAmendsTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: WaitForAmendsApiService },
    { provide: TaskService, useClass: WaitForAmendsService },
  ]);
}

export function provideWaitForAmendsStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EditDueDateFlowManager }]);
}

export function provideWaitForAmendsPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: EditDueDatePayloadMutator }]);
}
