import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  peerReviewDecisionProviders,
  provideEmpPeerReviewPayloadMutators,
  provideEmpPeerReviewSideEffects,
  provideEmpPeerReviewStepFlowManagers,
  provideEmpPeerReviewTaskServices,
} from '@requests/tasks/emp-peer-review/emp-peer-review.providers';
import { resetPersistableStateGuard } from '@shared/guards';

export const EMP_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpPeerReviewPayloadMutators(),
      SideEffectsHandler,
      provideEmpPeerReviewSideEffects(),
      provideEmpPeerReviewTaskServices(),
      provideEmpPeerReviewStepFlowManagers(),
    ],
    canActivate: [resetPersistableStateGuard],
    children: [
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/operator-details').then((r) => r.OPERATOR_DETAILS_ROUTES),
      },
      {
        path: 'emissions',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/emission-sources').then((r) => r.EMISSION_SOURCE_ROUTES),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'data-gaps',
        loadChildren: () =>
          import('@requests/tasks/emp-peer-review/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'mandate',
        loadChildren: () => import('@requests/tasks/emp-peer-review/subtasks/mandate').then((r) => r.MANDATE_ROUTES),
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
