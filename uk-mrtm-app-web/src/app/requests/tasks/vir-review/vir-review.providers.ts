import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { VirReviewApiService, VirReviewService } from '@requests/tasks/vir-review/services';
import {
  ReportSummaryFlowManager,
  ReportSummaryFormPayloadMutator,
  ReportSummarySideEffect,
} from '@requests/tasks/vir-review/subtasks/report-summary';
import { RespondToOperatorFlowManager } from '@requests/tasks/vir-review/subtasks/respond-to-operator';
import { RespondToOperatorFormPayloadMutator } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator-form';
import { RespondToOperatorSummaryPayloadMutator } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator-summary';

export const provideVirReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskService, useClass: VirReviewService },
    { provide: TaskApiService, useClass: VirReviewApiService },
  ]);

export const provideVirReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToOperatorFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToOperatorSummaryPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ReportSummaryFormPayloadMutator },
  ]);

export const provideVirReviewSideEffects = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: SIDE_EFFECTS, multi: true, useClass: ReportSummarySideEffect }]);

export const provideVirReviewStepFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: RespondToOperatorFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ReportSummaryFlowManager },
  ]);
