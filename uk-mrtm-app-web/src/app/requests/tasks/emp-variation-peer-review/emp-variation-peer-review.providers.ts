import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskApiService, TaskService } from '@netz/common/forms';

import {
  EmpVariationPeerReviewApiService,
  EmpVariationPeerReviewService,
} from '@requests/tasks/emp-variation-peer-review/services';

export function provideEmpVariationPeerReviewTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskService, useClass: EmpVariationPeerReviewService },
    { provide: TaskApiService, useClass: EmpVariationPeerReviewApiService },
  ]);
}
