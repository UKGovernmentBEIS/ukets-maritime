import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { EmpReviewNotifyOperatorSuccessComponent } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success';
import {
  provideEmpReviewPayloadMutators,
  provideEmpReviewSideEffects,
  provideEmpReviewStepFlowManagers,
  provideEmpReviewTaskServices,
} from '@requests/tasks/emp-review/emp-review.providers';
import {
  canActivateEmpReviewActions,
  canActivateEmpReviewOperatorAmendsAction,
} from '@requests/tasks/emp-review/guards';

export const EMP_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpReviewPayloadMutators(),
      SideEffectsHandler,
      provideEmpReviewSideEffects(),
      provideEmpReviewTaskServices(),
      provideEmpReviewStepFlowManagers(),
    ],
    children: [
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/operator-details').then((r) => r.OPERATOR_DETAILS_ROUTES),
      },
      {
        path: 'data-gaps',
        loadChildren: () => import('@requests/tasks/emp-review/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'abbreviations',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/additional-documents').then((r) => r.ADDITIONAL_DOCUMENTS_ROUTES),
      },
      {
        path: 'management-procedures',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/management-procedures').then(
            (r) => r.MANAGEMENT_PROCEDURES_ROUTES,
          ),
      },
      {
        path: 'control-activities',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/control-activities').then((r) => r.CONTROL_ACTIVITY_ROUTES),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/emission-sources').then((r) => r.EMISSION_SOURCE_ROUTES),
      },
      {
        path: 'emissions',
        loadChildren: () => import('@requests/tasks/emp-review/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: MANDATE_SUB_TASK,
        loadChildren: () => import('@requests/tasks/emp-review/subtasks/mandate').then((r) => r.MANDATE_REVIEW_ROUTES),
      },
      {
        path: 'overall-decision',
        loadChildren: () =>
          import('@requests/tasks/emp-review/subtasks/overall-decision').then((r) => r.OVERALL_DECISION_ROUTES),
      },
      {
        path: 'notify-operator',
        canActivate: [canActivateEmpReviewActions],
        providers: [{ provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT, useValue: EmpReviewNotifyOperatorSuccessComponent }],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: 'peer-review',
        canActivate: [canActivateEmpReviewActions],
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((r) => r.SEND_FOR_PEER_REVIEW_ROUTES),
      },
      {
        path: 'return-for-amends',
        title: 'Return for amends',
        canActivate: [canActivateEmpReviewOperatorAmendsAction],
        loadChildren: () => import('@requests/common/emp/return-for-amends').then((c) => c.RETURN_FOR_AMENDS_ROUTES),
      },
    ],
  },
];
