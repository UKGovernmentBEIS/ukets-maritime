import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  NonComplianceNoticeOfIntentApiService,
  NonComplianceNoticeOfIntentService,
} from '@requests/tasks/non-compliance-notice-of-intent/services';
import {
  NonComplianceNoticeOfIntentUploadFlowManager,
  NonComplianceNoticeOfIntentUploadFormPayloadMutator,
  NonComplianceNoticeOfIntentUploadInProgressSideEffect,
  NonComplianceNoticeOfIntentUploadSummarySideEffect,
} from '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload';

export function provideNonComplianceNoticeOfIntentPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: NonComplianceNoticeOfIntentUploadFormPayloadMutator },
  ]);
}

export function provideNonComplianceNoticeOfIntentTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: NonComplianceNoticeOfIntentApiService },
    { provide: TaskService, useClass: NonComplianceNoticeOfIntentService },
  ]);
}

export function provideNonComplianceNoticeOfIntentSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceNoticeOfIntentUploadInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: NonComplianceNoticeOfIntentUploadSummarySideEffect },
  ]);
}

export function provideNonComplianceNoticeOfIntentStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceNoticeOfIntentUploadFlowManager },
  ]);
}
