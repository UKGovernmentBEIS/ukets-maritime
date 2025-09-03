import { Routes } from '@angular/router';

import { MANDATE_SUB_TASK, mandateSubtaskMap } from '@requests/common/emp/subtasks/mandate';
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
        path: 'data-gaps',
        title: dataGapsMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/data-gaps').then((c) => c.DataGapsSubmittedComponent),
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
        path: 'greenhouse-gas',
        title: greenhouseGasMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/greenhouse-gas').then(
            (c) => c.GreenhouseGasSubmittedComponent,
          ),
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
        path: MANDATE_SUB_TASK,
        title: mandateSubtaskMap.title,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/timeline/emp-submitted/subtasks/mandate').then((c) => c.MandateSubmittedComponent),
      },
    ],
  },
];
