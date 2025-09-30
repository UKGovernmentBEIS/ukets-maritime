import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { isPaymentCompleted } from '@requests/common/payment';
import { EmpVariationNotifyOperatorSuccessComponent } from '@requests/tasks/emp-variation-review/components';
import {
  provideEmpVariationReviewPayloadMutators,
  provideEmpVariationReviewSideEffects,
  provideEmpVariationReviewStepFlowManagers,
  provideEmpVariationReviewTaskServices,
} from '@requests/tasks/emp-variation-review/emp-variation-review.providers';
import { canActivateEmpVariationReviewActions } from '@requests/tasks/emp-variation-review/guards';
import { HTML_DIFF } from '@shared/directives';

export const EMP_VARIATION_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpVariationReviewPayloadMutators(),
      provideEmpVariationReviewSideEffects(),
      provideEmpVariationReviewStepFlowManagers(),
      provideEmpVariationReviewTaskServices(),
      SideEffectsHandler,
      { provide: HTML_DIFF, useValue: true },
    ],
    children: [
      {
        path: 'variation-details',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/variation-details').then(
            (r) => r.VARIATION_REVIEW_DETAILS_ROUTES,
          ),
      },
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/operator-details').then(
            (r) => r.OPERATOR_DETAILS_ROUTES,
          ),
      },
      {
        path: 'abbreviations',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/additional-documents').then(
            (r) => r.ADDITIONAL_DOCUMENTS_ROUTES,
          ),
      },
      {
        path: 'control-activities',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/control-activities').then(
            (r) => r.CONTROL_ACTIVITY_ROUTES,
          ),
      },
      {
        path: 'data-gaps',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/emission-sources').then(
            (r) => r.EMISSION_SOURCE_ROUTES,
          ),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'management-procedures',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/management-procedures').then(
            (r) => r.MANAGEMENT_PROCEDURES_ROUTES,
          ),
      },
      {
        path: 'emissions',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: 'overall-decision',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-review/subtasks/overall-decision').then(
            (r) => r.OVERALL_DECISION_ROUTES,
          ),
      },
      {
        path: 'peer-review',
        canActivate: [canActivateEmpVariationReviewActions],
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((r) => r.SEND_FOR_PEER_REVIEW_ROUTES),
      },
      {
        path: 'notify-operator',
        data: { backlink: '../../', breadcrumb: false },
        canActivate: [canActivateEmpVariationReviewActions, isPaymentCompleted],
        providers: [
          { provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT, useValue: EmpVariationNotifyOperatorSuccessComponent },
        ],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: 'return-for-amends',
        title: 'Return for amends',
        loadChildren: () => import('@requests/common/emp/return-for-amends').then((c) => c.RETURN_FOR_AMENDS_ROUTES),
      },
    ],
  },
];
