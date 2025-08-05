import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { NotificationApiService, NotificationService } from '@requests/tasks/notification-submit/services';
import {
  DetailsChangeFlowManager,
  NonSignificantChangePayloadMutator,
  SummarySideEffect,
} from '@requests/tasks/notification-submit/subtasks/details-change';

export const provideNotificationMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: PAYLOAD_MUTATORS, multi: true, useClass: NonSignificantChangePayloadMutator }]);

export const provideNotificationTaskService = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NotificationApiService },
    { provide: TaskService, useClass: NotificationService },
  ]);

export const provideNotificationSideEffects = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: SIDE_EFFECTS, multi: true, useClass: SummarySideEffect }]);

export const provideNotificationStepFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DetailsChangeFlowManager }]);
