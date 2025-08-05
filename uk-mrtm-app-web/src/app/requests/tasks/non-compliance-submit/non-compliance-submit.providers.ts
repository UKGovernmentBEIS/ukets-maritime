import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  NonComplianceSubmitApiService,
  NonComplianceSubmitService,
} from '@requests/tasks/non-compliance-submit/services';
import {
  NonComplianceDetailsCivilPenaltyPayloadMutator,
  NonComplianceDetailsFlowManager,
  NonComplianceDetailsFormPayloadMutator,
  NonComplianceDetailsInitialPenaltyPayloadMutator,
  NonComplianceDetailsInProgressSideEffect,
  NonComplianceDetailsNoticeOfIntentPayloadMutator,
  NonComplianceDetailsSelectedRequestsPayloadMutator,
  NonComplianceDetailsSummarySideEffect,
} from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details';

export function provideNonComplianceSubmitPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceDetailsFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceDetailsSelectedRequestsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceDetailsCivilPenaltyPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceDetailsNoticeOfIntentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceDetailsInitialPenaltyPayloadMutator },
  ]);
}

export function provideNonComplianceSubmitTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceSubmitApiService },
    { provide: TaskService, useClass: NonComplianceSubmitService },
  ]);
}

export function provideNonComplianceSubmitSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceDetailsInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceDetailsSummarySideEffect },
  ]);
}

export function provideNonComplianceSubmitStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceDetailsFlowManager },
  ]);
}
