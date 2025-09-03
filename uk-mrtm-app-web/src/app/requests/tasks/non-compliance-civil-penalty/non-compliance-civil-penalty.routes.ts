import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_PATH } from '@requests/common/components/notify-operator';
import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { SEND_FOR_PEER_REVIEW_PATH } from '@requests/common/components/peer-review';
import { NonComplianceCivilPenaltyNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-civil-penalty/components/non-compliance-civil-penalty-notify-operator-success';
import {
  provideNonComplianceCivilPenaltyPayloadMutators,
  provideNonComplianceCivilPenaltySideEffects,
  provideNonComplianceCivilPenaltyStepFlowManagers,
  provideNonComplianceCivilPenaltyTaskServices,
} from '@requests/tasks/non-compliance-civil-penalty/non-compliance-civil-penalty.providers';

export const NON_COMPLIANCE_CIVIL_PENALTY_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceCivilPenaltyPayloadMutators(),
      SideEffectsHandler,
      provideNonComplianceCivilPenaltySideEffects(),
      provideNonComplianceCivilPenaltyTaskServices(),
      provideNonComplianceCivilPenaltyStepFlowManagers(),
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@requests/tasks/non-compliance-civil-penalty/subtasks/upload').then(
            (c) => c.NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_ROUTES,
          ),
      },
      {
        path: NOTIFY_OPERATOR_PATH,
        providers: [
          {
            provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT,
            useValue: NonComplianceCivilPenaltyNotifyOperatorSuccessComponent,
          },
        ],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: SEND_FOR_PEER_REVIEW_PATH,
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((c) => c.SEND_FOR_PEER_REVIEW_ROUTES),
      },
    ],
  },
];
