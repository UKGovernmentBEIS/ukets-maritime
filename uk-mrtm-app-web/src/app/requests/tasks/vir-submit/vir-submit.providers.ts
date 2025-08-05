import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { VirSubmitApiService, VirSubmitService } from '@requests/tasks/vir-submit/services';
import {
  RespondToRecommendationFlowManager,
  RespondToRecommendationFormPayloadMutator,
  RespondToRecommendationSummaryPayloadMutator,
  UploadEvidenceFormPayloadMutator,
  UploadEvidenceQuestionFormPayloadMutator,
} from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';

export const provideVirSubmitTaskServices = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TaskService, useClass: VirSubmitService },
    { provide: TaskApiService, useClass: VirSubmitApiService },
  ]);

export const provideVirSubmitPayloadMutators = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToRecommendationFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UploadEvidenceQuestionFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UploadEvidenceFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RespondToRecommendationSummaryPayloadMutator },
  ]);

export const provideVirSubmitSideEffects = (): EnvironmentProviders => makeEnvironmentProviders([]);

export const provideVirSubmitStepFlowManagers = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: RespondToRecommendationFlowManager },
  ]);
