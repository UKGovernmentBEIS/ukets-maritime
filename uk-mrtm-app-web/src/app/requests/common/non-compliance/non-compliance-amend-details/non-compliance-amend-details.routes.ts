import { Routes } from '@angular/router';

import {
  PayloadMutatorsHandler,
  SideEffectsHandler,
  TaskApiService,
  TaskService,
  WIZARD_FLOW_MANAGERS,
} from '@netz/common/forms';

import { provideNonComplianceDetailsBasePayloadMutator } from '@requests/common/non-compliance/components/non-compliance-details-base/non-compliance-details-base.payload-mutator';
import { NON_COMPLIANCE_AMEND_DETAILS_SUB_TASK } from '@requests/common/non-compliance/non-compliance-amend-details/non-compliance-amend-details.const';
import { NonComplianceAmendDetailsFlowManager } from '@requests/common/non-compliance/non-compliance-amend-details/non-compliance-amend-details.flow-manager';
import { NonComplianceAmendDetailsApiService } from '@requests/common/non-compliance/non-compliance-amend-details/services/non-compliance-amend-details.api.service';
import { NonComplianceAmendDetailsService } from '@requests/common/non-compliance/non-compliance-amend-details/services/non-compliance-amend-details.service';

export const NON_COMPLIANCE_AMEND_DETAILS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceDetailsBasePayloadMutator(NON_COMPLIANCE_AMEND_DETAILS_SUB_TASK, null),
      SideEffectsHandler,
      { provide: TaskApiService, useClass: NonComplianceAmendDetailsApiService },
      { provide: TaskService, useClass: NonComplianceAmendDetailsService },
      { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: NonComplianceAmendDetailsFlowManager },
    ],
    children: [
      {
        path: '',
        title: 'Enter non-compliance details',
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/common/non-compliance/components/non-compliance-details-base').then(
            (c) => c.NonComplianceDetailsBaseComponent,
          ),
      },
    ],
  },
];
