import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  AER_AGGREGATED_DATA_SUB_TASK_PATH,
  aerAggregatedDataRouteProviders,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { aerPortsRouteProviders, canActivateAerPorts } from '@requests/common/aer/subtasks/aer-ports';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { canActivateGuardedAerSubtask } from '@requests/common/aer/subtasks/aer-subtasks.guard';
import { canActivateAerTotalEmissionsSubtask } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.guard';
import { AER_TOTAL_EMISSIONS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { aerVoyagesRouteProviders } from '@requests/common/aer/subtasks/aer-voyages';
import { canActivateAerVoyages } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.guard';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { MONITORING_PLAN_CHANGES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  canActivateReductionClaimSubtask,
} from '@requests/common/aer/subtasks/reduction-claim';
import { REPORTING_OBLIGATION_SUB_TASK_PATH } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK_PATH } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK_PATH } from '@requests/common/utils/additional-documents';
import { canActivateAerAmendSendReportAction } from '@requests/tasks/aer-amend/aer-amend.guard';
import {
  provideAerSubmitPayloadMutators,
  provideAerSubmitSideEffects,
  provideAerSubmitStepFlowManagers,
  provideAerSubmitTaskServices,
} from '@requests/tasks/aer-amend/aer-amend.providers';

export const AER_AMEND_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideAerSubmitPayloadMutators(),
      SideEffectsHandler,
      provideAerSubmitSideEffects(),
      provideAerSubmitTaskServices(),
      provideAerSubmitStepFlowManagers(),
    ],
    canActivateChild: [],
    children: [
      {
        path: REPORTING_OBLIGATION_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/common/aer/subtasks/reporting-obligation').then((r) => r.AER_REPORTING_OBLIGATION_ROUTES),
      },
      {
        path: OPERATOR_DETAILS_SUB_TASK_PATH,
        canActivate: [canActivateGuardedAerSubtask],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/aer-operator-details').then((r) => r.AER_OPERATOR_DETAILS_ROUTES),
      },
      {
        path: MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
        canActivate: [canActivateGuardedAerSubtask],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/monitoring-plan-changes').then(
            (r) => r.AER_MONITORING_PLAN_CHANGES_ROUTES,
          ),
      },
      {
        path: EMISSIONS_SUB_TASK_PATH,
        canActivate: [canActivateGuardedAerSubtask],
        loadChildren: () => import('@requests/common/aer/subtasks/aer-emissions').then((r) => r.AER_EMISSIONS_ROUTES),
      },
      {
        path: AER_PORTS_SUB_TASK,
        providers: [...aerPortsRouteProviders],
        canActivate: [canActivateAerPorts],
        loadChildren: () => import('@requests/common/aer/subtasks/aer-ports').then((r) => r.AER_PORTS_ROUTES),
      },
      {
        path: AER_VOYAGES_SUB_TASK,
        providers: [...aerVoyagesRouteProviders],
        canActivate: [canActivateAerVoyages],
        loadChildren: () => import('@requests/common/aer/subtasks/aer-voyages').then((r) => r.AER_VOYAGES_ROUTES),
      },
      {
        path: AER_AGGREGATED_DATA_SUB_TASK_PATH,
        providers: [...aerAggregatedDataRouteProviders],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/aer-aggregated-data').then((r) => r.AER_AGGREGATED_DATA_ROUTES),
      },
      {
        path: AER_REDUCTION_CLAIM_SUB_TASK,
        canActivate: [canActivateReductionClaimSubtask],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/reduction-claim').then((r) => r.REDUCTION_CLAIM_ROUTES),
      },
      {
        path: ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
        canActivate: [canActivateGuardedAerSubtask],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/aer-additional-documents').then(
            (r) => r.AER_ADDITIONAL_DOCUMENTS_ROUTES,
          ),
      },
      {
        path: AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
        canActivate: [canActivateAerTotalEmissionsSubtask],
        loadChildren: () =>
          import('@requests/common/aer/subtasks/aer-total-emissions').then((r) => r.AER_TOTAL_EMISSIONS_ROUTES),
      },
      {
        path: 'send-report',
        canActivate: [canActivateAerAmendSendReportAction],
        loadChildren: () => import('@requests/tasks/aer-amend/subtasks/send-report').then((r) => r.SEND_REPORT_ROUTES),
      },
      {
        path: 'requested-changes',
        loadChildren: () =>
          import('@requests/tasks/aer-amend/subtasks/requested-changes').then((r) => r.REQUEST_CHANGES_ROUTES),
      },
    ],
  },
];
