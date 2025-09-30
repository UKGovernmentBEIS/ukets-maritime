import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import { provideNonComplianceDetailsBasePayloadMutator } from '@requests/common/non-compliance/components/non-compliance-details-base';
import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NonComplianceDetailsStep,
} from '@requests/common/non-compliance/non-compliance-details';
import {
  NonComplianceSubmitApiService,
  NonComplianceSubmitService,
} from '@requests/tasks/non-compliance-submit/services';
import {
  NonComplianceDetailsCivilPenaltyPayloadMutator,
  NonComplianceDetailsFlowManager,
  NonComplianceDetailsInitialPenaltyPayloadMutator,
  NonComplianceDetailsInProgressSideEffect,
  NonComplianceDetailsNoticeOfIntentPayloadMutator,
  NonComplianceDetailsSelectedRequestsPayloadMutator,
  NonComplianceDetailsSummarySideEffect,
} from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details';

export function provideNonComplianceSubmitPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideNonComplianceDetailsBasePayloadMutator(
      NON_COMPLIANCE_DETAILS_SUB_TASK,
      NonComplianceDetailsStep.DETAILS_FORM,
    ),
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
