import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_PATH } from '@requests/common/components/notify-operator';
import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { SEND_FOR_PEER_REVIEW_PATH } from '@requests/common/components/peer-review';
import { NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent } from '@requests/tasks/non-compliance-notice-of-intent/components/non-compliance-notice-of-intent-notify-operator-success';
import {
  provideNonComplianceNoticeOfIntentPayloadMutators,
  provideNonComplianceNoticeOfIntentSideEffects,
  provideNonComplianceNoticeOfIntentStepFlowManagers,
  provideNonComplianceNoticeOfIntentTaskServices,
} from '@requests/tasks/non-compliance-notice-of-intent/non-compliance-notice-of-intent.providers';

export const NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideNonComplianceNoticeOfIntentPayloadMutators(),
      SideEffectsHandler,
      provideNonComplianceNoticeOfIntentSideEffects(),
      provideNonComplianceNoticeOfIntentTaskServices(),
      provideNonComplianceNoticeOfIntentStepFlowManagers(),
    ],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@requests/tasks/non-compliance-notice-of-intent/subtasks/upload').then(
            (c) => c.NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_ROUTES,
          ),
      },
      {
        path: NOTIFY_OPERATOR_PATH,
        providers: [
          {
            provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT,
            useValue: NonComplianceNoticeOfIntentNotifyOperatorSuccessComponent,
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
