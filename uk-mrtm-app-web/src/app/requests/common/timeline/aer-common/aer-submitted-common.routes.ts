import { Routes } from '@angular/router';

import { AER_AGGREGATED_DATA_SUB_TASK_PATH } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_TOTAL_EMISSIONS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { MONITORING_PLAN_CHANGES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim';
import { EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK_PATH } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK_PATH } from '@requests/common/utils/additional-documents';

export const AER_SUBMITTED_ROUTES_COMMON_CHILDREN: Routes = [
  {
    path: OPERATOR_DETAILS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/operator-details-submitted').then(
        (c) => c.OperatorDetailsSubmittedComponent,
      ),
  },
  {
    path: MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/monitoring-plan-changes-submitted').then(
        (c) => c.MonitoringPlanChangesSubmittedComponent,
      ),
  },
  {
    path: EMISSIONS_SUB_TASK_PATH,
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/emissions').then((c) => c.ListOfShipsSummaryComponent),
      },
      {
        path: 'ships/:shipId',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/emissions').then((c) => c.ShipSummaryComponent),
      },
    ],
  },
  {
    path: AER_VOYAGES_SUB_TASK,
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-voyages').then(
            (c) => c.AerListOfVoyagesSubmittedComponent,
          ),
      },
      {
        path: `:voyageId`,
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-voyages').then(
            (c) => c.AerVoyageSubmittedComponent,
          ),
      },
    ],
  },
  {
    path: AER_PORTS_SUB_TASK,
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-ports').then(
            (c) => c.AerListOfPortCallsSubmittedComponent,
          ),
      },
      {
        path: `:portId`,
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-ports').then(
            (c) => c.AerPortCallSubmittedComponent,
          ),
      },
    ],
  },
  {
    path: AER_AGGREGATED_DATA_SUB_TASK_PATH,
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-aggregated-data').then(
            (c) => c.AerAggregatedDataListSubmittedComponent,
          ),
      },
      {
        path: `:dataId`,
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/common/timeline/aer-common/subtasks/aer-aggregated-data').then(
            (c) => c.AerAggregatedDataShipSubmittedComponent,
          ),
      },
    ],
  },
  {
    path: AER_REDUCTION_CLAIM_SUB_TASK,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/reduction-claim-submitted').then(
        (c) => c.ReductionClaimSubmittedComponent,
      ),
  },
  {
    path: ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/additional-documents-submitted').then(
        (c) => c.AdditionalDocumentsSubmittedComponent,
      ),
  },
  {
    path: AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/aer-total-emissions-submitted').then(
        (c) => c.AerTotalEmissionsSubmittedComponent,
      ),
  },
];
