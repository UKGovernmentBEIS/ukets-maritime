import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { SEND_REPORT_SUB_TASK_PATH } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report/send-report.helpers';
import {
  provideVirRespondToRegulatorCommentsPayloadMutators,
  provideVirRespondToRegulatorCommentsSideEffects,
  provideVirRespondToRegulatorCommentsStepFlowManagers,
  provideVirRespondToRegulatorCommentsTaskServices,
} from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.providers';

export const VIR_RESPOND_TO_REGULATOR_COMMENTS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideVirRespondToRegulatorCommentsPayloadMutators(),
      provideVirRespondToRegulatorCommentsSideEffects(),
      provideVirRespondToRegulatorCommentsTaskServices(),
      provideVirRespondToRegulatorCommentsStepFlowManagers(),
    ],
    children: [
      {
        path: RESPOND_TO_REGULATOR_SUBTASK,
        loadChildren: () =>
          import('@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator').then(
            (r) => r.RESPOND_TO_REGULATOR_ROUTES,
          ),
      },
      {
        path: SEND_REPORT_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/vir-respond-to-regulator-comments/subtasks/send-report').then(
            (r) => r.SEND_REPORT_ROUTES,
          ),
      },
    ],
  },
];
