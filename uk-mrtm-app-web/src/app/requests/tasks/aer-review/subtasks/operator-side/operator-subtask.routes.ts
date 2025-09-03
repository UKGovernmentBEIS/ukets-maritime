import { Routes } from '@angular/router';

import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents';
import {
  AER_AGGREGATED_DATA_PARAM,
  AER_AGGREGATED_DATA_SUB_TASK,
  AER_AGGREGATED_DATA_SUB_TASK_PATH,
  aerAggregatedDataSubtasksListMap,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORT_PARAM, AER_PORTS_SUB_TASK, aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerTotalEmissionsMap, monitoringPlanChangesMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  AER_TOTAL_EMISSIONS_SUB_TASK,
  AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGE_PARAM, AER_VOYAGES_SUB_TASK, aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { emissionsShipSubtaskMap, emissionsSubtaskMap } from '@requests/common/components/emissions';
import { EMISSIONS_SUB_TASK, EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import {
  OPERATOR_DETAILS_SUB_TASK,
  OPERATOR_DETAILS_SUB_TASK_PATH,
  operatorDetailsMap,
} from '@requests/common/components/operator-details';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
} from '@requests/common/utils/additional-documents';
import {
  AER_REVIEW_GROUP,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_TASK_TITLE,
  AerReviewWizardSteps,
} from '@requests/tasks/aer-review/aer-review.constants';
import { operatorSideSummariesProvidersMap } from '@requests/tasks/aer-review/subtasks/operator-side/operator-subtask-summary.providers';
import { REVIEW_APPLICATION_ROUTES } from '@requests/tasks/aer-review/subtasks/review-application';

export const OPERATOR_SUBTASK_ROUTES: Routes = [
  {
    path: OPERATOR_DETAILS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: OPERATOR_DETAILS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: operatorDetailsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'OPERATOR_DETAILS' },
      operatorSideSummariesProvidersMap[OPERATOR_DETAILS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: MONITORING_PLAN_CHANGES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: monitoringPlanChangesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'MONITORING_PLAN_CHANGES' },
      operatorSideSummariesProvidersMap[MONITORING_PLAN_CHANGES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: EMISSIONS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: EMISSIONS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: emissionsSubtaskMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'LIST_OF_SHIPS' },
      operatorSideSummariesProvidersMap[EMISSIONS_SUB_TASK],
    ],
    children: [
      ...REVIEW_APPLICATION_ROUTES,
      {
        path: `:shipId`,
        data: { breadcrumb: false, backlink: '../' },
        title: emissionsShipSubtaskMap.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/emissions/ship-submitted').then(
            (c) => c.ShipSummaryComponent,
          ),
      },
      {
        path: `${AerReviewWizardSteps.FORM}/:shipId`,
        data: { breadcrumb: false, backlink: '../' },
        title: emissionsShipSubtaskMap.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/emissions/ship-submitted').then(
            (c) => c.ShipSummaryComponent,
          ),
      },
    ],
  },
  {
    path: AER_VOYAGES_SUB_TASK,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_VOYAGES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerVoyagesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'VOYAGES' },
      operatorSideSummariesProvidersMap[AER_VOYAGES_SUB_TASK],
    ],
    children: [
      ...REVIEW_APPLICATION_ROUTES,
      {
        path: `:${AER_VOYAGE_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerVoyagesMap.totalEmissions.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-voyages/aer-voyage-submitted').then(
            (c) => c.AerVoyageSubmittedComponent,
          ),
      },
      {
        path: `${AerReviewWizardSteps.FORM}/:${AER_VOYAGE_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerVoyagesMap.totalEmissions.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-voyages/aer-voyage-submitted').then(
            (c) => c.AerVoyageSubmittedComponent,
          ),
      },
    ],
  },
  {
    path: AER_PORTS_SUB_TASK,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_PORTS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerPortsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'PORTS' },
      operatorSideSummariesProvidersMap[AER_PORTS_SUB_TASK],
    ],
    children: [
      ...REVIEW_APPLICATION_ROUTES,
      {
        path: `:${AER_PORT_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerPortsMap.totalEmissions.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-ports/aer-port-call-submitted').then(
            (c) => c.AerPortCallSubmittedComponent,
          ),
      },
      {
        path: `${AerReviewWizardSteps.FORM}/:${AER_PORT_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerPortsMap.totalEmissions.title,
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-ports/aer-port-call-submitted').then(
            (c) => c.AerPortCallSubmittedComponent,
          ),
      },
    ],
  },
  {
    path: AER_AGGREGATED_DATA_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_AGGREGATED_DATA_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerAggregatedDataSubtasksListMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'AGGREGATED_EMISSIONS_DATA' },
      operatorSideSummariesProvidersMap[AER_AGGREGATED_DATA_SUB_TASK],
    ],
    children: [
      ...REVIEW_APPLICATION_ROUTES,
      {
        path: `:${AER_AGGREGATED_DATA_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerAggregatedDataSubtasksListMap.title,
        loadComponent: () =>
          import(
            '@requests/tasks/aer-verification-submit/view-only-subtasks/aer-aggregated-data/aer-aggregated-data-ship-submitted'
          ).then((c) => c.AerAggregatedDataShipSubmittedComponent),
      },
      {
        path: `${AerReviewWizardSteps.FORM}/:${AER_AGGREGATED_DATA_PARAM}`,
        data: { breadcrumb: false, backlink: '../' },
        title: aerAggregatedDataSubtasksListMap.title,
        loadComponent: () =>
          import(
            '@requests/tasks/aer-verification-submit/view-only-subtasks/aer-aggregated-data/aer-aggregated-data-ship-submitted'
          ).then((c) => c.AerAggregatedDataShipSubmittedComponent),
      },
    ],
  },
  {
    path: AER_REDUCTION_CLAIM_SUB_TASK,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_REDUCTION_CLAIM_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: reductionClaimMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'EMISSIONS_REDUCTION_CLAIM' },
      operatorSideSummariesProvidersMap[AER_REDUCTION_CLAIM_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: ADDITIONAL_DOCUMENTS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerAdditionalDocumentsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'ADDITIONAL_DOCUMENTS' },
      operatorSideSummariesProvidersMap[ADDITIONAL_DOCUMENTS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_TOTAL_EMISSIONS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerTotalEmissionsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'TOTAL_EMISSIONS' },
      operatorSideSummariesProvidersMap[AER_TOTAL_EMISSIONS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
];
