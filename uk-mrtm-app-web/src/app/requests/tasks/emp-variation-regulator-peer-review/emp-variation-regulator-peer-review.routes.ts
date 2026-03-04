import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  abbreviationsMap,
  additionalDocumentsMap,
  controlActivitiesMap,
  dataGapsMap,
  emissionSourcesMap,
  emissionsSubTasksMap,
  greenhouseGasMap,
  identifyMaritimeOperatorMap,
  managementProceduresMap,
  mandateMap,
} from '@requests/common/emp/subtasks/subtask-list.map';
import {
  peerReviewDecisionProviders,
  provideEmpPeerReviewPayloadMutators,
  provideEmpPeerReviewSideEffects,
  provideEmpPeerReviewStepFlowManagers,
} from '@requests/tasks/emp-peer-review/emp-peer-review.providers';
import { provideEmpVariationRegulatorPeerReviewTaskServices } from '@requests/tasks/emp-variation-regulator-peer-review/emp-variation-regulator-peer-review.providers';
import { HTML_DIFF } from '@shared/directives';
import { resetPersistableStateGuard } from '@shared/guards';

export const EMP_VARIATION_REGULATOR_PEER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpPeerReviewPayloadMutators(),
      SideEffectsHandler,
      provideEmpPeerReviewSideEffects(),
      provideEmpVariationRegulatorPeerReviewTaskServices(),
      provideEmpPeerReviewStepFlowManagers(),
      { provide: HTML_DIFF, useValue: true },
    ],
    canActivate: [resetPersistableStateGuard],
    children: [
      {
        path: 'variation-details',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-variation-details/emp-var-reg-peer-review-variation-details.component').then(
            (c) => c.EmpVarRegPeerReviewVariationDetailsComponent,
          ),
      },
      {
        path: 'operator-details',
        title: identifyMaritimeOperatorMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-operator-details/emp-var-reg-peer-review-operator-details.component').then(
            (c) => c.EmpVarRegPeerReviewOperatorDetailsComponent,
          ),
      },
      {
        path: 'emissions',
        children: [
          {
            path: '',
            title: emissionsSubTasksMap.title,
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-emissions/emp-var-reg-peer-review-emissions.component').then(
                (c) => c.EmpVarRegPeerReviewEmissionsComponent,
              ),
          },
          {
            path: 'ships/:shipId',
            title: emissionsSubTasksMap.title,
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () => import('@requests/common/emp/subtasks/emissions').then((c) => c.ShipSummaryComponent),
          },
        ],
      },
      {
        path: 'emission-sources',
        title: emissionSourcesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-emission-sources/emp-var-reg-peer-review-emission-sources.component').then(
            (c) => c.EmpVarRegPeerReviewEmissionSourcesComponent,
          ),
      },
      {
        path: 'greenhouse-gas',
        title: greenhouseGasMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-greenhouse-gas/emp-var-reg-peer-review-greenhouse-gas.component').then(
            (c) => c.EmpVarRegPeerReviewGreenhouseGasComponent,
          ),
      },
      {
        path: 'data-gaps',
        title: dataGapsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-mandate/emp-var-reg-peer-review-mandate.component').then(
            (c) => c.EmpVarRegPeerReviewMandateComponent,
          ),
      },
      {
        path: 'mandate',
        title: mandateMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-mandate/emp-var-reg-peer-review-mandate.component').then(
            (c) => c.EmpVarRegPeerReviewMandateComponent,
          ),
      },
      {
        path: 'management-procedures',
        title: managementProceduresMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-management-procedures/emp-var-reg-peer-review-management-procedures.component').then(
            (c) => c.EmpVarRegPeerReviewManagementProceduresComponent,
          ),
      },
      {
        path: 'control-activities',
        title: controlActivitiesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-control-activities/emp-var-reg-peer-review-control-activities.component').then(
            (c) => c.EmpVarRegPeerReviewControlActivitiesComponent,
          ),
      },
      {
        path: 'abbreviations',
        title: abbreviationsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-abbreviations/emp-var-reg-peer-review-abbreviations.component').then(
            (c) => c.EmpVarRegPeerReviewAbbreviationsComponent,
          ),
      },
      {
        path: 'additional-documents',
        title: additionalDocumentsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/emp-variation-regulator-peer-review/subtasks/emp-var-reg-peer-review-additional-documents/emp-var-reg-peer-review-additional-documents.component').then(
            (c) => c.EmpVarRegPeerReviewAdditionalDocumentsComponent,
          ),
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
