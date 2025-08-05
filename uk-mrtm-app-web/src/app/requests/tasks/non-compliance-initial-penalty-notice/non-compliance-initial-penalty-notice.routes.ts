import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_PATH } from '@requests/common/components/notify-operator';
import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { SEND_FOR_PEER_REVIEW_PATH } from '@requests/common/components/peer-review';
import { NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/components/non-compliance-initial-penalty-notice-notify-operator-success';
import {
  provideNonComplianceInitialPenaltyNoticePayloadMutators,
  provideNonComplianceInitialPenaltyNoticeSideEffects,
  provideNonComplianceInitialPenaltyNoticeStepFlowManagers,
  provideNonComplianceInitialPenaltyNoticeTaskServices,
} from '@requests/tasks/non-compliance-initial-penalty-notice/non-compliance-initial-penalty-notice.providers';

export const NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceInitialPenaltyNoticePayloadMutators(),
      SideEffectsHandler,
      provideNonComplianceInitialPenaltyNoticeSideEffects(),
      provideNonComplianceInitialPenaltyNoticeTaskServices(),
      provideNonComplianceInitialPenaltyNoticeStepFlowManagers(),
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload').then(
            (c) => c.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_ROUTES,
          ),
      },
      {
        path: NOTIFY_OPERATOR_PATH,
        providers: [
          {
            provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT,
            useValue: NonComplianceInitialPenaltyNoticeNotifyOperatorSuccessComponent,
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
