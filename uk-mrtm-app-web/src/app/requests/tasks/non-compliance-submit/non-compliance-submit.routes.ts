import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NON_COMPLIANCE_SUBMIT_SUCCESS_MESSAGE_PATH } from '@requests/common/non-compliance';
import {
  provideNonComplianceSubmitPayloadMutators,
  provideNonComplianceSubmitSideEffects,
  provideNonComplianceSubmitStepFlowManagers,
  provideNonComplianceSubmitTaskServices,
} from '@requests/tasks/non-compliance-submit/non-compliance-submit.providers';

export const NON_COMPLIANCE_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceSubmitPayloadMutators(),
      SideEffectsHandler,
      provideNonComplianceSubmitSideEffects(),
      provideNonComplianceSubmitTaskServices(),
      provideNonComplianceSubmitStepFlowManagers(),
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@requests/tasks/non-compliance-submit/subtasks/non-compliance-details').then(
            (c) => c.NON_COMPLIANCE_DETAILS_ROUTES,
          ),
      },
      {
        path: NON_COMPLIANCE_SUBMIT_SUCCESS_MESSAGE_PATH,
        title: 'Non-compliance details completed',
        loadComponent: () =>
          import('@requests/tasks/non-compliance-submit/components/non-compliance-submit-success').then(
            (c) => c.NonComplianceSuccessComponent,
          ),
      },
    ],
  },
];
