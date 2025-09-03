import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { canActivateEmpAmendSendApplicationAction } from '@requests/tasks/emp-amend/emp-amend.guard';
import {
  provideEmpAmendPayloadMutators,
  provideEmpAmendSideEffects,
  provideEmpAmendStepFlowManagers,
  provideEmpAmendTaskServices,
} from '@requests/tasks/emp-amend/emp-amend.providers';

export const EMP_AMEND_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideEmpAmendPayloadMutators(),
      provideEmpAmendSideEffects(),
      provideEmpAmendStepFlowManagers(),
      provideEmpAmendTaskServices(),
    ],
    children: [
      {
        path: 'requested-changes',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/requested-changes').then((r) => r.REQUEST_CHANGES_ROUTES),
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
        path: MANDATE_SUB_TASK,
        loadChildren: () => import('@requests/common/emp/subtasks/mandate').then((r) => r.MANDATE_ROUTES),
      },
      {
        path: 'send-application',
        canActivate: [canActivateEmpAmendSendApplicationAction],
        loadChildren: () =>
          import('@requests/common/emp/subtasks/send-application').then((r) => r.SEND_APPLICATION_ROUTES),
      },
    ],
  },
];
