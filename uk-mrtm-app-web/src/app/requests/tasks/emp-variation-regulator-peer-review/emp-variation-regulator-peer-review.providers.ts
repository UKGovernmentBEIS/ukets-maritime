import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskApiService, TaskService } from '@netz/common/forms';

import {
  EmpVariationRegulatorPeerReviewApiService,
  EmpVariationRegulatorPeerReviewService,
} from '@requests/tasks/emp-variation-regulator-peer-review/services';

export function provideEmpVariationRegulatorPeerReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpVariationRegulatorPeerReviewService },
    { provide: TaskApiService, useClass: EmpVariationRegulatorPeerReviewApiService },
  ]);
}
