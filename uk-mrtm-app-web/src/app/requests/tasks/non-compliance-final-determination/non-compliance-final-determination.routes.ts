import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NON_COMPLIANCE_FINAL_DETERMINATION_SUCCESS_MESSAGE_PATH } from '@requests/common/non-compliance';
import {
  provideNonComplianceFinalDeterminationPayloadMutators,
  provideNonComplianceFinalDeterminationSideEffects,
  provideNonComplianceFinalDeterminationStepFlowManagers,
  provideNonComplianceFinalDeterminationTaskServices,
} from '@requests/tasks/non-compliance-final-determination/non-compliance-final-determination.providers';

export const NON_COMPLIANCE_FINAL_DETERMINATION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceFinalDeterminationPayloadMutators(),
      SideEffectsHandler,
      provideNonComplianceFinalDeterminationSideEffects(),
      provideNonComplianceFinalDeterminationTaskServices(),
      provideNonComplianceFinalDeterminationStepFlowManagers(),
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details'
          ).then((c) => c.NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_ROUTES),
      },
      {
        path: NON_COMPLIANCE_FINAL_DETERMINATION_SUCCESS_MESSAGE_PATH,
        title: 'Non-compliance details completed',
        loadComponent: () =>
          import(
            '@requests/tasks/non-compliance-final-determination/components/non-compliance-final-determination-success'
          ).then((c) => c.NonComplianceSuccessComponent),
      },
    ],
  },
];
