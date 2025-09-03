import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  NonComplianceCivilPenaltyApiService,
  NonComplianceCivilPenaltyService,
} from '@requests/tasks/non-compliance-civil-penalty/services';
import {
  NonComplianceCivilPenaltyUploadFlowManager,
  NonComplianceCivilPenaltyUploadFormPayloadMutator,
  NonComplianceCivilPenaltyUploadInProgressSideEffect,
  NonComplianceCivilPenaltyUploadSummarySideEffect,
} from '@requests/tasks/non-compliance-civil-penalty/subtasks/upload';

export function provideNonComplianceCivilPenaltyPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceCivilPenaltyUploadFormPayloadMutator },
  ]);
}

export function provideNonComplianceCivilPenaltyTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceCivilPenaltyApiService },
    { provide: TaskService, useClass: NonComplianceCivilPenaltyService },
  ]);
}

export function provideNonComplianceCivilPenaltySideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceCivilPenaltyUploadInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceCivilPenaltyUploadSummarySideEffect },
  ]);
}

export function provideNonComplianceCivilPenaltyStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceCivilPenaltyUploadFlowManager },
  ]);
}
