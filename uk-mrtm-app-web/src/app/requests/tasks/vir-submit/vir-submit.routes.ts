import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { RESPOND_TO_RECOMMENDATION_SUBTASK } from '@requests/common/vir/subtasks/respond-to-recommendation';
import { SEND_REPORT_SUB_TASK_PATH } from '@requests/tasks/vir-submit/subtasks/send-report/send-report.helpers';
import {
  provideVirSubmitPayloadMutators,
  provideVirSubmitSideEffects,
  provideVirSubmitStepFlowManagers,
  provideVirSubmitTaskServices,
} from '@requests/tasks/vir-submit/vir-submit.providers';

export const VIR_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideVirSubmitPayloadMutators(),
      provideVirSubmitTaskServices(),
      provideVirSubmitSideEffects(),
      provideVirSubmitStepFlowManagers(),
    ],
    children: [
      {
        path: RESPOND_TO_RECOMMENDATION_SUBTASK,
        loadChildren: () =>
          import('@requests/tasks/vir-submit/subtasks/respond-to-recommendation').then(
            (r) => r.RESPOND_TO_RECOMMENDATION_ROUTES,
          ),
      },
      {
        path: SEND_REPORT_SUB_TASK_PATH,
        loadChildren: () => import('@requests/tasks/vir-submit/subtasks/send-report').then((r) => r.SEND_REPORT_ROUTES),
      },
    ],
  },
];
