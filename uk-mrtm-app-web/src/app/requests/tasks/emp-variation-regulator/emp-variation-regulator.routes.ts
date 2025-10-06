import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { NOTIFY_OPERATOR_SUCCESS_COMPONENT } from '@requests/common/components/notify-operator/notify-operator.providers';
import { isPaymentCompleted } from '@requests/common/payment';
import { EmpVariationRegulatorSuccessComponent } from '@requests/tasks/emp-variation-regulator/components';
import {
  provideEmpVariationRegulatorPayloadMutators,
  provideEmpVariationRegulatorSideEffects,
  provideEmpVariationRegulatorStepFlowManagers,
  provideEmpVariationRegulatorTaskServices,
} from '@requests/tasks/emp-variation-regulator/emp-variation-regulator.providers';
import { canActivateEmpVariationRegulatorActions } from '@requests/tasks/emp-variation-regulator/guards';
import { HTML_DIFF } from '@shared/directives';

export const EMP_VARIATION_REGULATOR_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpVariationRegulatorPayloadMutators(),
      SideEffectsHandler,
      provideEmpVariationRegulatorSideEffects(),
      provideEmpVariationRegulatorTaskServices(),
      provideEmpVariationRegulatorStepFlowManagers(),
      { provide: HTML_DIFF, useValue: true },
    ],
    children: [
      {
        path: 'variation-details',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/variation-regulator-details').then(
            (r) => r.EMP_VARIATION_REGULATOR_DETAILS_ROUTES,
          ),
      },
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/operator-details').then(
            (r) => r.OPERATOR_DETAILS_ROUTES,
          ),
      },
      {
        path: 'emissions',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/emission-sources').then(
            (r) => r.EMISSION_SOURCE_ROUTES,
          ),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/greenhouse-gas').then(
            (r) => r.GREENHOUSE_GAS_ROUTES,
          ),
      },
      {
        path: 'data-gaps',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'mandate',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/mandate').then((r) => r.MANDATE_ROUTES),
      },
      {
        path: 'management-procedures',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/management-procedures').then(
            (r) => r.MANAGEMENT_PROCEDURES_ROUTES,
          ),
      },
      {
        path: 'control-activities',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/control-activities').then(
            (r) => r.CONTROL_ACTIVITY_ROUTES,
          ),
      },
      {
        path: 'abbreviations',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/tasks/emp-variation-regulator/subtasks/additional-documents').then(
            (r) => r.ADDITIONAL_DOCUMENTS_ROUTES,
          ),
      },
      {
        path: 'notify-operator',
        data: { backlink: '../../', breadcrumb: false },
        canActivate: [canActivateEmpVariationRegulatorActions, isPaymentCompleted],
        providers: [{ provide: NOTIFY_OPERATOR_SUCCESS_COMPONENT, useValue: EmpVariationRegulatorSuccessComponent }],
        loadChildren: () => import('@requests/common/components/notify-operator').then((r) => r.NOTIFY_OPERATOR_ROUTES),
      },
      {
        path: 'peer-review',
        canActivate: [canActivateEmpVariationRegulatorActions, isPaymentCompleted],
        loadChildren: () =>
          import('@requests/common/components/peer-review').then((r) => r.SEND_FOR_PEER_REVIEW_ROUTES),
      },
    ],
  },
];
