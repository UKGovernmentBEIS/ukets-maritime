import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { DoeSubmitApiService, DoeSubmitService } from '@requests/tasks/doe-submit/services';
import { MaritimeEmissionsFlowManager } from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { ChargeOperatorPayloadMutator } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/charge-operator';
import { DeterminationReasonPayloadMutator } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/determination-reason';
import { FeeDetailsPayloadMutator } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/fee-details';
import { MaritimeEmissionsSummarySideEffect } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions-summary';
import { TotalMaritimeEmissionsPayloadMutator } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/total-maritime-emissions';

export const provideDoeMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DeterminationReasonPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: TotalMaritimeEmissionsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ChargeOperatorPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: FeeDetailsPayloadMutator },
  ]);

export const provideDoeTaskService = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskApiService, useClass: DoeSubmitApiService },
    { provide: TaskService, useClass: DoeSubmitService },
  ]);

export const provideDoeSideEffects = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: SIDE_EFFECTS, multi: true, useClass: MaritimeEmissionsSummarySideEffect }]);

export const provideDoeStepFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: MaritimeEmissionsFlowManager }]);
