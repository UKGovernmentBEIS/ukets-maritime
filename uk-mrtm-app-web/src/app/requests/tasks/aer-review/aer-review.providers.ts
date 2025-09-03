import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskApiService, TaskService } from '@netz/common/forms';

import {
  OPERATOR_SUBTASKS,
  REPORTING_OBLIGATION_SUBTASKS,
  VERIFIER_SUBTASKS,
} from '@requests/common/aer/aer-subtask-groups.const';
import { provideReviewOperatorsApplicationFlowManager } from '@requests/tasks/aer-review/flow-managers';
import {
  reviewOperatorsApplicationFormSubtaskPayloadMutator,
  reviewOperatorsApplicationSummarySubtaskPayloadMutator,
} from '@requests/tasks/aer-review/payload-mutators';
import { AerReviewApiService, AerReviewService } from '@requests/tasks/aer-review/services';

export const provideAerReviewTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskService, useClass: AerReviewService },
    { provide: TaskApiService, useClass: AerReviewApiService },
  ]);

export const provideAerReviewPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders(
    [OPERATOR_SUBTASKS, VERIFIER_SUBTASKS, REPORTING_OBLIGATION_SUBTASKS]
      .flat()
      .map((subtask) => [
        reviewOperatorsApplicationFormSubtaskPayloadMutator(subtask),
        reviewOperatorsApplicationSummarySubtaskPayloadMutator(subtask),
      ])
      .flat(),
  );

export const provideAerReviewSideEffects = (): EnvironmentProviders => makeEnvironmentProviders([]);

export const provideAerReviewFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders(
    [OPERATOR_SUBTASKS, VERIFIER_SUBTASKS, REPORTING_OBLIGATION_SUBTASKS]
      .flat()
      .map((subtask) => provideReviewOperatorsApplicationFlowManager(subtask)),
  );
