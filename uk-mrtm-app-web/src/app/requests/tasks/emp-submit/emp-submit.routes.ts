import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import { canActivateEmpSubmitSendApplicationAction } from '@requests/tasks/emp-submit/emp-submit.guard';
import {
  provideEmpSubmitPayloadMutators,
  provideEmpSubmitSideEffects,
  provideEmpSubmitStepFlowManagers,
  provideEmpSubmitTaskServices,
} from '@requests/tasks/emp-submit/emp-submit.providers';
import { IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.const';

export const EMP_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideEmpSubmitPayloadMutators(),
      SideEffectsHandler,
      provideEmpSubmitSideEffects(),
      provideEmpSubmitTaskServices(),
      provideEmpSubmitStepFlowManagers(),
    ],
    children: [
      {
        path: 'operator-details',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/operator-details').then((r) => r.OPERATOR_DETAILS_ROUTES),
      },
      {
        path: 'emissions',
        loadChildren: () => import('@requests/common/emp/subtasks/emissions').then((r) => r.EMISSIONS_ROUTES),
      },
      {
        path: 'emission-sources',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/emission-sources').then((r) => r.EMISSION_SOURCE_ROUTES),
      },
      {
        path: 'greenhouse-gas',
        loadChildren: () => import('@requests/common/emp/subtasks/greenhouse-gas').then((r) => r.GREENHOUSE_GAS_ROUTES),
      },
      {
        path: 'data-gaps',
        loadChildren: () => import('@requests/common/emp/subtasks/data-gaps').then((r) => r.DATA_GAPS_ROUTES),
      },
      {
        path: 'mandate',
        loadChildren: () => import('@requests/common/emp/subtasks/mandate').then((r) => r.MANDATE_ROUTES),
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
        path: 'abbreviations',
        loadChildren: () => import('@requests/common/emp/subtasks/abbreviations').then((r) => r.ABBREVIATIONS_ROUTES),
      },
      {
        path: 'additional-documents',
        loadChildren: () =>
          import('@requests/common/emp/subtasks/additional-documents').then((r) => r.ADDITIONAL_DOCUMENTS_ROUTES),
      },
      {
        path: 'send-application',
        canActivate: [canActivateEmpSubmitSendApplicationAction],
        loadChildren: () =>
          import('@requests/common/emp/subtasks/send-application').then((r) => r.SEND_APPLICATION_ROUTES),
      },
      {
        path: IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH,
        data: { backlink: '../../', breadcrumb: false },
        loadComponent: () =>
          import('@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider-import').then(
            (c) => c.ThirdPartyDataProviderImportComponent,
          ),
      },
    ],
  },
];
