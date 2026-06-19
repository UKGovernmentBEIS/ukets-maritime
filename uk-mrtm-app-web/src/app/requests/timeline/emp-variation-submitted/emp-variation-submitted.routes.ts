import { Routes } from '@angular/router';

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

export const EMP_VARIATION_SUBMITTED_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'variation-details',
        title: identifyMaritimeOperatorMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-variation-details').then(
            (c) => c.EmpVarSubmittedVariationDetailsComponent,
          ),
      },
      {
        path: 'operator-details',
        title: identifyMaritimeOperatorMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-operator-details').then(
            (c) => c.EmpVarSubmittedOperatorDetailsComponent,
          ),
      },
      {
        path: 'data-gaps',
        title: dataGapsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-data-gaps').then(
            (c) => c.EmpVarSubmittedDataGapsComponent,
          ),
      },
      {
        path: 'mandate',
        title: mandateMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-mandate').then(
            (c) => c.EmpVarSubmittedMandateComponent,
          ),
      },
      {
        path: 'abbreviations',
        title: abbreviationsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-abbreviations').then(
            (c) => c.EmpVarSubmittedAbbreviationsComponent,
          ),
      },
      {
        path: 'additional-documents',
        title: additionalDocumentsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-additional-documents').then(
            (c) => c.EmpVarSubmittedAdditionalDocumentsComponent,
          ),
      },
      {
        path: 'management-procedures',
        title: managementProceduresMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-management-procedures').then(
            (c) => c.EmpVarSubmittedManagementProceduresComponent,
          ),
      },
      {
        path: 'control-activities',
        title: controlActivitiesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-control-activities').then(
            (c) => c.EmpVarSubmittedControlActivitiesComponent,
          ),
      },
      {
        path: 'greenhouse-gas',
        title: greenhouseGasMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-greenhouse-gas').then(
            (c) => c.EmpVarSubmittedGreenhouseGasComponent,
          ),
      },
      {
        path: 'emission-sources',
        title: emissionSourcesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-emission-sources').then(
            (c) => c.EmpVarSubmittedEmissionSourcesComponent,
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
              import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-list-of-ships').then(
                (c) => c.EmpVarSubmittedListOfShipsComponent,
              ),
          },
          {
            path: 'ships/:shipId',
            title: emissionsSubTasksMap.title,
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/timeline/emp-variation-submitted/subtasks/emp-var-submitted-ship/').then(
                (c) => c.EmpVarSubmittedShipComponent,
              ),
          },
        ],
      },
    ],
  },
];
