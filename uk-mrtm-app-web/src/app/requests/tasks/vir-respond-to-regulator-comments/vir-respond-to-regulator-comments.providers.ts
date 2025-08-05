import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  VirRespondToRegulatorApiService,
  VirRespondToRegulatorService,
} from '@requests/tasks/vir-respond-to-regulator-comments/services';
import {
  RespondToRegulatorFlowManager,
  RespondToRegulatorFormPayloadMutator,
  RespondToRegulatorSummaryPayloadMutator,
} from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator';

export const provideVirRespondToRegulatorCommentsTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskService, useClass: VirRespondToRegulatorService },
    { provide: TaskApiService, useClass: VirRespondToRegulatorApiService },
  ]);

export const provideVirRespondToRegulatorCommentsPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToRegulatorFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToRegulatorSummaryPayloadMutator },
  ]);

export const provideVirRespondToRegulatorCommentsSideEffects = (): EnvironmentProviders => makeEnvironmentProviders([]);

export const provideVirRespondToRegulatorCommentsStepFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: RespondToRegulatorFlowManager }]);
