import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  NonComplianceFinalDeterminationApiService,
  NonComplianceFinalDeterminationService,
} from '@requests/tasks/non-compliance-final-determination/services';
import {
  NonComplianceFinalDeterminationDetailsFlowManager,
  NonComplianceFinalDeterminationDetailsFormPayloadMutator,
  NonComplianceFinalDeterminationDetailsInProgressSideEffect,
  NonComplianceFinalDeterminationDetailsSummarySideEffect,
} from '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details';

export function provideNonComplianceFinalDeterminationPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceFinalDeterminationDetailsFormPayloadMutator },
  ]);
}

export function provideNonComplianceFinalDeterminationTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceFinalDeterminationApiService },
    { provide: TaskService, useClass: NonComplianceFinalDeterminationService },
  ]);
}

export function provideNonComplianceFinalDeterminationSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceFinalDeterminationDetailsInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceFinalDeterminationDetailsSummarySideEffect },
  ]);
}

export function provideNonComplianceFinalDeterminationStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceFinalDeterminationDetailsFlowManager },
  ]);
}
