import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { SEND_VARIATION_SUCCESS_COMPONENT } from '@requests/common/emp/subtasks/send-variation';
import { SubmitSendVariationSuccessComponent } from '@requests/tasks/emp-variation/components/submit-send-variation-success';
import {
  provideEmpVariationPayloadMutators,
  provideEmpVariationSideEffects,
  provideEmpVariationStepFlowManagers,
  provideEmpVariationTaskServices,
} from '@requests/tasks/emp-variation/emp-variation.providers';

export const EMP_VARIATION_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpVariationPayloadMutators(),
      SideEffectsHandler,
      provideEmpVariationSideEffects(),
      provideEmpVariationTaskServices(),
      provideEmpVariationStepFlowManagers(),
    ],
    children: [
      {
        path: 'variation-details',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/variation-details').then((r) => r.EMP_VARIATION_DETAILS_ROUTES),
      },
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/operator-details').then((r) => r.OPERATOR_DETAILS_ROUTES),
      },
      {
        path: 'data-gaps',
        loadChildren: () => import('@requests/common/emp/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'abbreviations',
        loadChildren: () => import('@requests/common/emp/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/additional-documents').then((r) => r.ADDITIONAL_DOCUMENTS_ROUTES),
      },
      {
        path: 'management-procedures',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/management-procedures').then((r) => r.MANAGEMENT_PROCEDURES_ROUTES),
      },
      {
        path: 'control-activities',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/control-activities').then((r) => r.CONTROL_ACTIVITY_ROUTES),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () => import('@requests/common/emp/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/emission-sources').then((r) => r.EMISSION_SOURCE_ROUTES),
      },
      {
        path: 'emissions',
        loadChildren: () => import('@requests/common/emp/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: 'send-variation',
        providers: [{ provide: SEND_VARIATION_SUCCESS_COMPONENT, useValue: SubmitSendVariationSuccessComponent }],
        loadChildren: () => import('@requests/common/emp/subtasks/send-variation').then((r) => r.SEND_VARIATION_ROUTES),
      },
    ],
  },
];
