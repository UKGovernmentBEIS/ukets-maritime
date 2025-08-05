import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { DoeSubmitNotifyOperatorSuccessComponent } from '@requests/tasks/doe-submit/components';
import { canActivateSubmitActions } from '@requests/tasks/doe-submit/doe-submit.guard';
import {
  provideDoeMutators,
  provideDoeSideEffects,
  provideDoeStepFlowManagers,
  provideDoeTaskService,
} from '@requests/tasks/doe-submit/doe-submit.providers';

export const DOE_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideDoeMutators(),
      provideDoeSideEffects(),
      provideDoeStepFlowManagers(),
      provideDoeTaskService(),
    ],
    children: [
      {
        path: 'maritime-emissions',
        loadChildren: () =>
          import('@requests/tasks/doe-submit/subtasks/maritime-emissions').then((r) => r.MARITIME_EMISSIONS_ROUTES),
      },
      {
        path: 'notify-operator',
        canActivate: [canActivateSubmitActions],
        providers: [{ provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT, useValue: DoeSubmitNotifyOperatorSuccessComponent }],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: 'peer-review',
        canActivate: [canActivateSubmitActions],
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((r) => r.SEND_FOR_PEER_REVIEW_ROUTES),
      },
    ],
  },
];
