import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  NonComplianceInitialPenaltyNoticeApiService,
  NonComplianceInitialPenaltyNoticeService,
} from '@requests/tasks/non-compliance-initial-penalty-notice/services';
import {
  NonComplianceInitialPenaltyNoticeUploadFlowManager,
  NonComplianceInitialPenaltyNoticeUploadFormPayloadMutator,
  NonComplianceInitialPenaltyNoticeUploadInProgressSideEffect,
  NonComplianceInitialPenaltyNoticeUploadSummarySideEffect,
} from '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload';

export function provideNonComplianceInitialPenaltyNoticePayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceInitialPenaltyNoticeUploadFormPayloadMutator },
  ]);
}

export function provideNonComplianceInitialPenaltyNoticeTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceInitialPenaltyNoticeApiService },
    { provide: TaskService, useClass: NonComplianceInitialPenaltyNoticeService },
  ]);
}

export function provideNonComplianceInitialPenaltyNoticeSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceInitialPenaltyNoticeUploadInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceInitialPenaltyNoticeUploadSummarySideEffect },
  ]);
}

export function provideNonComplianceInitialPenaltyNoticeStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceInitialPenaltyNoticeUploadFlowManager },
  ]);
}
