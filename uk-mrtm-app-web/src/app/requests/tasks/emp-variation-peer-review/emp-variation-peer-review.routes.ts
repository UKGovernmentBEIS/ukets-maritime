import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import {
  peerReviewDecisionProviders,
  provideEmpPeerReviewPayloadMutators,
  provideEmpPeerReviewSideEffects,
  provideEmpPeerReviewStepFlowManagers,
} from '@requests/tasks/emp-peer-review/emp-peer-review.providers';
import { provideEmpVariationPeerReviewTaskServices } from '@requests/tasks/emp-variation-peer-review/emp-variation-peer-review.providers';

export const EMP_VARIATION_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpPeerReviewPayloadMutators(),
      SideEffectsHandler,
      provideEmpPeerReviewSideEffects(),
      provideEmpVariationPeerReviewTaskServices(),
      provideEmpPeerReviewStepFlowManagers(),
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
          import('@requests/tasks/emp-peer-review/subtasks/operator-details').then((r) => r.OPERATOR_DETAILS_ROUTES),
      },
      {
        path: 'data-gaps',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'abbreviations',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/additional-documents').then(
            (r) => r.ADDITIONAL_DOCUMENTS_ROUTES,
          ),
      },
      {
        path: 'management-procedures',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/management-procedures').then(
            (r) => r.MANAGEMENT_PROCEDURES_ROUTES,
          ),
      },
      {
        path: 'control-activities',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/control-activities').then((r) => r.CONTROL_ACTIVITY_ROUTES),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/emission-sources').then((r) => r.EMISSION_SOURCE_ROUTES),
      },
      {
        path: 'emissions',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: MANDATE_SUB_TASK,
        loadChildren: () => import('@requests/common/emp/subtasks/mandate').then((r) => r.MANDATE_ROUTES),
      },
      {
        path: 'overall-decision',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/overall-decision').then((r) => r.OVERALL_DECISION_ROUTES),
      },
      {
        path: 'review-decision',
        providers: [peerReviewDecisionProviders],
        loadChildren: () =>
          import('@requests/common/subtasks/peer-review-decision').then((r) => r.PEER_REVIEW_DECISION_ROUTES),
      },
    ],
  },
];
