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

export const EMP_SUBMITTED_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'operator-details',
        title: identifyMaritimeOperatorMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/operator-details').then(
            (c) => c.OperatorDetailsSubmittedComponent,
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
              import('@requests/timeline/emp-submitted/subtasks/emissions').then((c) => c.ListOfShipsSummaryComponent),
          },
          {
            path: 'ships/:shipId',
            title: emissionsSubTasksMap.title,
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/timeline/emp-submitted/subtasks/emissions').then((c) => c.ShipSummaryComponent),
          },
        ],
      },
      {
        path: 'emission-sources',
        title: emissionSourcesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/emission-sources').then(
            (c) => c.EmissionSourcesSubmittedComponent,
          ),
      },
      {
        path: 'greenhouse-gas',
        title: greenhouseGasMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/greenhouse-gas').then(
            (c) => c.GreenhouseGasSubmittedComponent,
          ),
      },
      {
        path: 'data-gaps',
        title: dataGapsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/data-gaps').then((c) => c.DataGapsSubmittedComponent),
      },
      {
        path: 'mandate',
        title: mandateMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/mandate').then((c) => c.MandateSubmittedComponent),
      },
      {
        path: 'management-procedures',
        title: managementProceduresMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/management-procedures').then(
            (c) => c.ManagementProceduresSubmittedComponent,
          ),
      },
      {
        path: 'control-activities',
        title: controlActivitiesMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/control-activities').then(
            (c) => c.ControlActivitiesSubmittedComponent,
          ),
      },
      {
        path: 'abbreviations',
        title: abbreviationsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/abbreviations').then(
            (c) => c.AbbreviationsSubmittedComponent,
          ),
      },
      {
        path: 'additional-documents',
        title: additionalDocumentsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/additional-documents').then(
            (c) => c.AdditionalDocumentsSubmittedComponent,
          ),
      },
    ],
  },
];
