import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { RESPOND_TO_OPERATOR_SUBTASK, REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { VirReviewNotifyOperatorSuccessComponent } from '@requests/tasks/vir-review/components';
import {
  provideVirReviewPayloadMutators,
  provideVirReviewSideEffects,
  provideVirReviewStepFlowManagers,
  provideVirReviewTaskServices,
} from '@requests/tasks/vir-review/vir-review.providers';

export const VIR_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideVirReviewPayloadMutators(),
      provideVirReviewSideEffects(),
      provideVirReviewTaskServices(),
      provideVirReviewStepFlowManagers(),
    ],
    children: [
      {
        path: RESPOND_TO_OPERATOR_SUBTASK,
        loadChildren: () =>
          import('@requests/tasks/vir-review/subtasks/respond-to-operator').then((r) => r.RESPOND_TO_OPERATOR_ROUTES),
      },
      {
        path: REVIEW_REPORT_SUMMARY_SUBTASK,
        loadChildren: () =>
          import('@requests/tasks/vir-review/subtasks/report-summary').then((r) => r.REVIEW_REPORT_SUMMARY_ROUTES),
      },
      {
        path: 'send-report',
        providers: [{ provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT, useValue: VirReviewNotifyOperatorSuccessComponent }],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
    ],
  },
];
