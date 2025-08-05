import { Routes } from '@angular/router';

import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AER_AGGREGATED_DATA_SUB_TASK_PATH,
  aerAggregatedDataSubtasksListMap,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK, aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerTotalEmissionsMap, monitoringPlanChangesMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  AER_TOTAL_EMISSIONS_SUB_TASK,
  AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK, aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { emissionsSubtaskMap } from '@requests/common/components/emissions';
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
} from '@requests/tasks/aer-review/aer-review.constants';
import { operatorSideSummariesProvidersMap } from '@requests/tasks/aer-review/subtasks/operator-side/operator-subtask-summary.providers';

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
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: AER_VOYAGES_SUB_TASK,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_VOYAGES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerVoyagesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'VOYAGES' },
      operatorSideSummariesProvidersMap[AER_VOYAGES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: AER_PORTS_SUB_TASK,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_PORTS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerPortsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'PORTS' },
      operatorSideSummariesProvidersMap[AER_PORTS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: AER_AGGREGATED_DATA_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: AER_AGGREGATED_DATA_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: aerAggregatedDataSubtasksListMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'AGGREGATED_EMISSIONS_DATA' },
      operatorSideSummariesProvidersMap[AER_AGGREGATED_DATA_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
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
